import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from 'src/car/car.module';
import { BuyModule } from 'src/buy/buy.module';
import { DetailbuyModule } from 'src/detailbuy/detailbuy.module';

@Module({
  imports: [CarModule, BuyModule, DetailbuyModule],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports:[PaypalService]
})
export class PaypalModule {}
