import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { BlogImage } from './entities/blog-image.entity';
import { CloudinaryModule } from 'src/cloudinay/cloudinay.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, BlogImage]),
    CloudinaryModule
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService]
})
export class BlogModule { }
