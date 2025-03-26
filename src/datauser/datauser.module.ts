import { Module } from '@nestjs/common';
import { DatauserService } from './datauser.service';
import { DatauserController } from './datauser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Datauser } from './entities/datauser.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Datauser]), UserModule],
  controllers: [DatauserController],
  providers: [DatauserService],
  exports: [DatauserService]
})
export class DatauserModule { }
