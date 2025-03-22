import { Module } from '@nestjs/common';
import { CashService } from './cash.service';
import { CashController } from './cash.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cash } from './entities/cash.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cash]),UserModule],
  controllers: [CashController],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule { }
