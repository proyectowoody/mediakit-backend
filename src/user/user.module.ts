import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/jwt.constants';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GoogleModule } from '../google/google.module';
import { GoogleStrategy } from '../google/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => GoogleModule),
  ],
  controllers: [UserController],
  providers: [UserService, GoogleStrategy],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
