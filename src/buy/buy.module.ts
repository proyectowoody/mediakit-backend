import { Module } from '@nestjs/common';
import { BuyService } from './buy.service';
import { BuyController } from './buy.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Buy } from './entities/buy.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Buy]),
    UserModule
  ],
  controllers: [BuyController],
  providers: [BuyService],
  exports: [BuyService],
})
export class BuyModule { }
