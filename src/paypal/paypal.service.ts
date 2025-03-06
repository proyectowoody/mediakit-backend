import { Injectable } from '@nestjs/common';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CarService } from 'src/car/car.service';
import { URL_BACKEND, URL_FRONTEND } from 'src/url';
import 'dotenv/config';
import axios from 'axios';
import { BuyService } from 'src/buy/buy.service';
import { DetailbuyService } from 'src/detailbuy/detailbuy.service';

@Injectable()
export class PaypalService {

  constructor(
    private readonly carService: CarService,
    private readonly buyService: BuyService,
    private readonly buyDetail: DetailbuyService
  ) { }

  async createPayment(email: string) {

    const totalGenerated = await this.carService.findOne(email);
    const total = totalGenerated.total;

    try {

      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'EUR',
              value: total.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'respectful-shoes',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
          return_url: `${URL_BACKEND}/paypal/capture?email=${email}`,
          cancel_url: `${URL_FRONTEND}/cart`,
        },
      };

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const {
        data: { access_token },
      } = await axios.post(
        `${process.env.URL_PAYPAL_TOKEN}`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: `${process.env.CLIENT_PAYPAL_ID}`,
            password: `${process.env.SECRET_PAYPAL_ID}`,
          },
        },
      );

      const response = await axios.post(
        `${process.env.URL_PAYPAL_ORDERS}`,
        order,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const data = response.data;
      const primerEnlace = data.links[1];
      return { primerEnlace }
    } catch (error) {
      console.error(error);
      throw new Error('Something went wrong');
    }
  }

  async capturePayment(token: string, email: string): Promise<any> {
    try {
      await axios.post(
        `${process.env.URL_PAYPAL_ORDERS}/${token}/capture`,
        {},
        {
          auth: {
            username: `${process.env.CLIENT_PAYPAL_ID}`,
            password: `${process.env.SECRET_PAYPAL_ID}`,
          },
        }
      );

      const compras = await this.carService.findOne(email);

      const userEmail = compras.articles.length > 0 ? compras.articles[0].userEmail : null;
      const buy = await this.buyService.create(userEmail);

      const idbuy = buy.id;
      const articleIds = compras.articles.map(item => item.article.id);

      await this.buyDetail.create(idbuy, articleIds);
      await this.carService.removeAll(email);

    } catch (error) {
      throw new Error('Error capturing payment');
    }
  }

}
