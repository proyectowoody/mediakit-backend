import { Module } from '@nestjs/common';
import { DetailbuyService } from './detailbuy.service';
import { DetailbuyController } from './detailbuy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Detailbuy } from './entities/detailbuy.entity';
import { BuyModule } from 'src/buy/buy.module';
import { ArticleModule } from 'src/article/article.module';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Detailbuy, Article]),
    BuyModule, ArticleModule
  ],
  controllers: [DetailbuyController],
  providers: [DetailbuyService],
  exports: [DetailbuyService],
})
export class DetailbuyModule { }
