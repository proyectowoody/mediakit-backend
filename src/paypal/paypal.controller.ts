import { Controller, Get, UseGuards, Query, Res, HttpException, HttpStatus, Request } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { URL_FRONTEND } from 'src/url';

@ApiTags("Paypal")
@Controller('paypal')
export class PaypalController {

  constructor(private readonly paypalService: PaypalService) {}

  @Get('create')
  @UseGuards(AuthGuard)
  async getByEmailTotal(@Request() req) {
    const email = req.user.email;
    return await this.paypalService.createPayment(email);
  }
  
  @Get('capture')
  async capturePayment( @Query('token') token: string, @Query('email') email: string, @Res() res) {
    try {
      await this.paypalService.capturePayment(token, email);
      return res.redirect(`${URL_FRONTEND}/thank`);
    } catch (error) {
      console.error(error.message);
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
