import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCashDto } from './dto/create-cash.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cash } from './entities/cash.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class CashService {
  constructor(
    @InjectRepository(Cash)
    private readonly cashRepository: Repository<Cash>,
    private readonly userService: UserService,
  ) { }

  async processCash(email: string, cash: string) {

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Correo no encontrado en la base de datos.');
    }

    const existingCash = await this.cashRepository.findOne({
      where: { user: user },
    });

    if (existingCash) {
      existingCash.cash = cash;
      await this.cashRepository.save(existingCash);
      return { message: 'Moneda actualizada correctamente', currency: cash };
    } else {

      const newCash = this.cashRepository.create({
        user: user,
        cash,
      });

      await this.cashRepository.save(newCash);
      return { message: 'Moneda guardada correctamente', currency: cash };
    }

  }

  private exchangeRateUrl = process.env.EXCHANGERATE;

  async getUserCash(email: string) {

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const cashData = await this.cashRepository.findOne({
      where: { user: { id: user.id } },
    });


    const userCurrency = cashData ? cashData.cash : 'EUR';

    const response = await axios.get(this.exchangeRateUrl);
    const exchangeRates = response.data.conversion_rates;

    const currencyRate = exchangeRates[userCurrency] || exchangeRates['EUR'];

    return {
      currency: userCurrency,
      conversionRate: currencyRate,
    };
  }

}
