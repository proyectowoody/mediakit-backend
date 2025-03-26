import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, UploadedFiles, HttpStatus, HttpException, Query } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { UpdateArticleDto } from './dto/update-article.dto';

@ApiTags("Articulos")
@Controller('articulos')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articleService.findAll();
  }

  @Get('/all')
  async findAllPlus(): Promise<Article[]> {
    return this.articleService.findAllPlus();
  }

  @Get('count')
  async countArticles() {
    return this.articleService.countArticles();
  }

  @Get("/ofertas")
  async findAllOfertas(): Promise<Article[]> {
    return this.articleService.findAllOffers();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Article> {
    return this.articleService.findOneById(id);
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

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('imagenes', 10))
  async update(
    @Param('id') id: string,
    @UploadedFiles() imagenes: Express.Multer.File[],
    @Body() updateArt: UpdateArticleDto
  ) {
    await this.articleService.updateArticle(id, updateArt);
    await this.articleService.updateImagen(id, imagenes);

    return { message: 'Artículo actualizado correctamente' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string) {
    return this.articleService.deleteArticle(id);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteArticle(
    @Query('imageUrl') imageUrl: string
  ) {
    if (!imageUrl) {
      throw new HttpException('La URL de la imagen es requerida', HttpStatus.BAD_REQUEST);
    }

    return this.articleService.deleteArticleImage(decodeURIComponent(imageUrl));
  }

}
