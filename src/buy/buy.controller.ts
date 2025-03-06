import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { BuyService } from './buy.service';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Buy")
@Controller('buy')
export class BuyController {
  constructor(private readonly buyService: BuyService) { }

  @Get(':email')
  @UseGuards(AuthGuard)
  async findOne(@Param('email') email: string) {
    return this.buyService.findOne(email);
  }

}
