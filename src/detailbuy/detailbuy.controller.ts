import { Controller, Get } from '@nestjs/common';
import { DetailbuyService } from './detailbuy.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Detailbuy')
@Controller('detailbuy')
export class DetailbuyController {
  constructor(private readonly detailbuyService: DetailbuyService) { }

  @Get('top-selling')
  async getTopSellingArticles() {
    return this.detailbuyService.getTopSellingArticles();
  }

}
