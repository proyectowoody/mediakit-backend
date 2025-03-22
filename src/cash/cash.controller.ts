import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CashService } from './cash.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';

@ApiTags('Cash')
@Controller('cash')
export class CashController {

  constructor(private readonly cashService: CashService) { }

  @Post()
  @UseGuards(AuthGuard)
  async handleCash(@Request() req, @Body() cashDto: { cash: string }) {
    const email = req.user.email;
    return this.cashService.processCash(email, cashDto.cash);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getCashConverted(@Request() req) {
    const email = req.user.email;
    return await this.cashService.getUserCash(email);
  }
}
