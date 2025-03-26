import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CommentarticleService } from './commentarticle.service';
import { CreateCommentarticleDto } from './dto/create-commentarticle.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';

@ApiTags('CommentarioArticulo')
@Controller('commentarticle')
export class CommentarticleController {
  constructor(private readonly commentarticleService: CommentarticleService) { }

  @Get()
  async findAll() {
    return this.commentarticleService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createCommentDto: CreateCommentarticleDto) {
    return this.commentarticleService.createSimpleComment(createCommentDto);
  }

  @Get(':id')
  getCommentsByArticle(@Param('id') id: number) {
    return this.commentarticleService.findByArticleId(+id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.commentarticleService.deleteById(+id);
  }

}
