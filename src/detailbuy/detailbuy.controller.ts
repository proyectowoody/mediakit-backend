import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetailbuyService } from './detailbuy.service';
import { CreateDetailbuyDto } from './dto/create-detailbuy.dto';
import { UpdateDetailbuyDto } from './dto/update-detailbuy.dto';
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
