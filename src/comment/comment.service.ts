import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { BuyService } from 'src/buy/buy.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
  ) { }

  async findAll() {
    return await this.commentRepository.find();
  }

  async createSimpleComment(email: string, createCommentDto: CreateCommentDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const newComment = this.commentRepository.create({
      descripcion: createCommentDto.descripcion,
      user,
    });

    return await this.commentRepository.save(newComment);
  }

  async deleteById(id: number) {
    const result = await this.commentRepository.delete(id);
    return {
      message: result.affected ? 'Comentario eliminado correctamente' : 'Comentario no encontrado',
    };
  }


}