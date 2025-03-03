import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { CreatePaypalDto } from './dto/create-paypal.dto';
import { UpdatePaypalDto } from './dto/update-paypal.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { URL_FRONTEND } from 'src/url';

@ApiTags("Paypal")
@Controller('paypal')
export class PaypalController {

  constructor(private readonly paypalService: PaypalService) {}

  @Get('create/:email')
  @UseGuards(AuthGuard)
  async getByEmailTotal(@Param('email') email: string) {
    return await this.paypalService.createPayment(email);
  }
  
  @Get('capture')
  async capturePayment( @Query('token') token: string, @Query('email') email: string, @Res() res) {
    try {
      await this.paypalService.capturePayment(token, email);
      return res.redirect(`${URL_FRONTEND}`);
    } catch (error) {
      console.error(error.message);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
