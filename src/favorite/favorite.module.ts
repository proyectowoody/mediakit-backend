import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { ArticleModule } from 'src/article/article.module';
import { UserModule } from 'src/user/user.module';
import { Favorite } from './entities/favorite.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Article]),
    forwardRef(() => UserModule),
    forwardRef(() => ArticleModule),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
