import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class FavoriteService {

  constructor(
    @InjectRepository(Favorite)
    private readonly favoritoRepository: Repository<Favorite>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  async findOne(email: string): Promise<any[]> {
    const user = await this.userService.findByEmail(email);
    const user_id = user.id;
  
    const favoritos = await this.favoritoRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'article'],
    });
  
    const formattedFavoritos = favoritos.map((fav) => ({
      article: fav.article,         
      userEmail: fav.user.email,    
    }));
  
    return formattedFavoritos;
  }
  

  async create(
    createFavoritoDto: CreateFavoriteDto,
  ): Promise<{ message: string; articulo_id: number }> {

    const { articulo_id, email_user } = createFavoritoDto;
    const user = await this.userService.findByEmail(email_user);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const user_id = user.id;

    const favoritoExistente = await this.favoritoRepository.findOne({
      where: { user: { id: user_id }, article: { id: articulo_id } },
    });

    if (favoritoExistente) {
      throw new BadRequestException('El artículo ya está en favoritos.');
    }

    const nuevoFavorito = this.favoritoRepository.create({
      user: { id: user_id },
      article: { id: articulo_id },
    });

    await this.favoritoRepository.save(nuevoFavorito);

    return {
      message: 'El artículo se ha agregado a favoritos.',
      articulo_id,
    };
  }

  async remove(
    articulo_id: number,
    email_user: string,
  ): Promise<{ message: string }> {

    const user = await this.userService.findByEmail(email_user);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const user_id = user.id;
    const result = await this.favoritoRepository.delete({
      article: { id: articulo_id },
      user: { id: user_id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`El favorito no fue encontrado.`);
    }

    return {
      message: 'Favorito eliminado.',
    };
  }


}
