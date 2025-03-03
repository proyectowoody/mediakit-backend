import { Module } from '@nestjs/common';
import { PaypalService } from './paypal.service';
import { PaypalController } from './paypal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarModule } from 'src/car/car.module';

@Module({
  imports: [CarModule],
  controllers: [PaypalController],
  providers: [PaypalService],
  exports:[PaypalService]
})
export class PaypalModule {}
