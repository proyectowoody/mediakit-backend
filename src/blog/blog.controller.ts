import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, HttpException, HttpStatus, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Blog } from './entities/blog.entity';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Get()
  async findAll(): Promise<Blog[]> {
    return this.blogService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 10))
  async create(
    @UploadedFiles() imagenes: Express.Multer.File[],
    @Body() newBlog: CreateBlogDto,
  ) {
    return await this.blogService.createBlog({
      ...newBlog,
      imagenes,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 10))
  async update(
    @Param('id') id: string,
    @UploadedFiles() imagenes: Express.Multer.File[],
    @Body() updateBlog: UpdateBlogDto
  ) {
    await this.blogService.updateBlog(id, updateBlog);
    await this.blogService.updateImagen(id, imagenes);

    console.log(id,updateBlog, imagenes );
    return { message: 'Blog actualizado correctamente' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.blogService.deleteBlog(id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Query('imageUrl') imageUrl: string
  ) {
    if (!imageUrl) {
      throw new HttpException('La URL de la imagen es requerida', HttpStatus.BAD_REQUEST);
    }

    return this.blogService.deleteBlogImage(decodeURIComponent(imageUrl));
  }

}
