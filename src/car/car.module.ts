import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { ArticleModule } from 'src/article/article.module';
import { Car } from './entities/car.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Car]),
    UserModule, ArticleModule
  ],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule { }
