
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Post(':email/:buy_id')
  @UseGuards(AuthGuard)
  create(@Param('email') email: string, @Param('buy_id') buy_id: number, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(email, buy_id, createCommentDto);
  }

  @Get(':email/:buy_id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('email') email: string,
    @Param('buy_id') buy_id: number
  ): Promise<{ id: number; descripcion: string } | null> {
    console.log(email, buy_id, "Data");
    return this.commentService.findOne(email, buy_id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }
  
}
