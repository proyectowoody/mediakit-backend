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
    private readonly buyService: BuyService,
  ) { }

  async create(email: string, buy_id: number, createCommentDto: CreateCommentDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const buy = await this.buyService.findById(buy_id);
    if (!buy) {
      throw new Error('Compra no encontrada');
    }

    const existingComment = await this.commentRepository.findOne({
      where: { user, buy },
    });

    if (existingComment) {
      await this.commentRepository.update(existingComment.id, {
        ...createCommentDto
      });

      return this.commentRepository.findOne({ where: { id: existingComment.id } });
    }

    const newComment = this.commentRepository.create({
      ...createCommentDto,
      user,
      buy,
    });

    return await this.commentRepository.save(newComment);
  }

  async findOne(email: string, buy_id: number): Promise<{ id: number, descripcion: string } | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const buy = await this.buyService.findById(buy_id);
    if (!buy) {
      throw new Error('Compra no encontrada');
    }

    const comment = await this.commentRepository.findOne({
      where: { user: { id: user.id }, buy: { id: buy.id } },
      relations: ["user", "buy"]
    });

    if (!comment) {
      return null;
    }

    return { id: comment.id, descripcion: comment.descripcion };
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const existingComment = await this.commentRepository.findOne({ where: { id } });
    if (!existingComment) {
      throw new NotFoundException(`Comentario no encontrado`);
    }

    await this.commentRepository.update(id, updateCommentDto);

    return this.commentRepository.findOne({ where: { id } });
  }

}