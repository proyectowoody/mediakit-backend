import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Commentario')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get()
  async findAll() {
    return this.commentService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Request() req,
    @Body() createCommentDto: CreateCommentDto
  ) {
    const email = req.user.email;
    return this.commentService.createSimpleComment(email, createCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.commentService.deleteById(+id);
  }

}
