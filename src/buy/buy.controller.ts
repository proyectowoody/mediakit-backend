import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { BuyService } from './buy.service';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Buy")
@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) { }

  @Get()
  @UseGuards(AuthGuard)
  async findOne(@Request() req) {
    const email = req.user.email;
    return this.buyService.findOne(email);
  }

}
