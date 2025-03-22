import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CloudinaryModule } from 'src/cloudinay/cloudinay.module';
import { CategoryModule } from 'src/category/category.module';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { ArticleImage } from './entities/article-image.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleImage]),
    CloudinaryModule,
    CategoryModule,
    SuppliersModule
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule { }
