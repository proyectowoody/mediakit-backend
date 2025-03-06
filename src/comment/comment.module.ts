import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UserModule } from 'src/user/user.module';
import { BuyModule } from 'src/buy/buy.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, BuyModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}
