import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Article } from './entities/article.entity';

@ApiTags("Articulos")
@Controller('articulos')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get('count')
  async countArticles() {
    return this.articleService.countArticles();
  }

  @Get("/ofertas")
  async findAllOfertas(): Promise<Article[]> {
    return this.articleService.findAllOffers();
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 10))
  async create(
    @UploadedFiles() imagenes: Express.Multer.File[],
    @Body() newArticle: CreateArticleDto,
  ) {
    return await this.articleService.createArticle({
      ...newArticle,
      imagenes,
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateArt: CreateArticleDto,
  ) {
    return this.articleService.updateArticle(id, updateArt);
  }

  @Patch('discount/:id')
  @UseGuards(AuthGuard)
  async updateOffer(
    @Param('id') id: string,
    @Body() updateArt: CreateArticleDto,
  ) {
    return this.articleService.updateArticleDiscount(id, updateArt);
  }

  @Patch('offer/:id')
  @UseGuards(AuthGuard)
  async updateDeleteOffer(
    @Param('id') id: number,
  ) {
    return this.articleService.removeOffer(id);
  }

  @Patch(':id/imagen')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  async updateImagen(
    @Param('id') id: string,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    return this.articleService.updateImagen(id, imagen);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.articleService.deleteArticle(id);
  }

}
