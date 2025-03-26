import { Module } from '@nestjs/common';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ArticleModule } from './article/article.module';
import { FavoriteModule } from './favorite/favorite.module';
import { CloudinaryModule } from './cloudinay/cloudinay.module';
import { CarModule } from './car/car.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PaypalModule } from './paypal/paypal.module';
import { BuyModule } from './buy/buy.module';
import { DetailbuyModule } from './detailbuy/detailbuy.module';
import { AddressModule } from './address/address.module';
import { CommentModule } from './comment/comment.module';
import { ContactModule } from './contact/contact.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CashModule } from './cash/cash.module';
import { BlogModule } from './blog/blog.module';
import { DiscountModule } from './discount/discount.module';
import { CommentarticleModule } from './commentarticle/commentarticle.module';
import { DatauserModule } from './datauser/datauser.module';
import 'dotenv/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 21747,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      connectTimeout: 60000,
      entities: [join(__dirname + '/**/*.entity{.ts,.js}')],
      synchronize: false,
      // logging: true,
      ssl: { rejectUnauthorized: false },
    }),
    ScheduleModule.forRoot(),
    UserModule,
    CategoryModule,
    ArticleModule,
    FavoriteModule,
    CloudinaryModule,
    CarModule,
    SuppliersModule,
    PaypalModule,
    BuyModule,
    DetailbuyModule,
    AddressModule,
    CommentModule,
    ContactModule,
    SubcategoryModule,
    CashModule,
    BlogModule,
    DiscountModule,
    CommentarticleModule,
    DatauserModule
  ],
})
export class AppModule { }


