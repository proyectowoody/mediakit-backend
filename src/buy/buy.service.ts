import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buy } from './entities/buy.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BuyService {

  constructor(
    private readonly userService: UserService,
    @InjectRepository(Buy)
    private readonly buyRepository: Repository<Buy>,
  ) { }

  async findOne(email: string): Promise<any[]> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const buys = await this.buyRepository.find({
      where: { user: { id: user.id } },
      relations: ['user', 'details', 'details.article', 'details.article.imagenes'], 
    });

    return buys.map(buy => ({
      id: buy.id,
      fecha: buy.fecha,
      user: {
        email: buy.user.email,
        role: buy.user.role
      },
      details: buy.details.map(detail => ({
        id: detail.id,
        fecha: detail.fecha,
        article: {
          id: detail.article.id,
          nombre: detail.article.nombre,
          descripcion: detail.article.descripcion,
          estado:detail.article.estado,
          imagenes: detail.article.imagenes.map(imagen => ({
            id: imagen.id,
            url: imagen.url 
          }))
        }
      }))
    }));
  }

  async create(email: string): Promise<Buy> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const newBuy = this.buyRepository.create({
      user,
    });

    return await this.buyRepository.save(newBuy);
  }

  async findById(id: number): Promise<Buy | null> {
    const buy = await this.buyRepository.findOne({ where: { id } });
    if (!buy) {
      throw new NotFoundException(`Comentario no encontrado`);
    }
    return buy;
  }
}
