import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarService {

  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly userService: UserService,
  ) { }

  async findOne(email: string): Promise<{ articles: any[]; total: number }> {
    const user = await this.userService.findByEmail(email);
    const user_id = user.id;

    const cars = await this.carRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'article', 'article.imagenes'],
    });

    const groupedArticles = new Map<number, any>();

    cars.forEach(car => {
      const article = car.article;
      const articleId = article.id;

      const finalPrice = article.offer && article.discount ? article.discount : article.precio;

      if (!groupedArticles.has(articleId)) {
        groupedArticles.set(articleId, {
          article: {
            id: article.id,
            nombre: article.nombre,
            descripcion: article.descripcion,
            fecha: article.fecha,
            estado: article.estado,
            precio: finalPrice,
            imagenes: article.imagenes.map(img => img.url),
          },
          cantidad: 1,
          subtotal: finalPrice,
          userEmail: car.user.email,
        });
      } else {
        const existingArticle = groupedArticles.get(articleId);
        existingArticle.cantidad += 1;
        existingArticle.subtotal += finalPrice;
      }
    });

    const formattedCars = Array.from(groupedArticles.values());
    const total = formattedCars.reduce((sum, car) => sum + car.subtotal, 0);

    return { articles: formattedCars, total };
  }

  async create(
    createCartDto: CreateCarDto,
  ): Promise<{ message: string; articulo_id: number }> {

    const { articulo_id, email_user } = createCartDto;
    const user = await this.userService.findByEmail(email_user);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const user_id = user.id;
    

    const nuevoFavorito = this.carRepository.create({
      user: { id: user_id },
      article: { id: articulo_id },
    });

    await this.carRepository.save(nuevoFavorito);

    return {
      message: 'El artículo se ha agregado al carrito.',
      articulo_id,
    };
  }

  async countUserCartItems(email_user: string): Promise<{ total: number }> {
    const user = await this.userService.findByEmail(email_user);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const total = await this.carRepository.count({
      where: { user: { id: user.id } },
    });

    return { total };
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
    const result = await this.carRepository.delete({
      article: { id: articulo_id },
      user: { id: user_id },
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Carrito no fue encontrado.`);
    }

    return {
      message: 'Favorito eliminado.',
    };
  }

  async removeAll(email_user: string): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email_user);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const user_id = user.id;
    const result = await this.carRepository.delete({ user: { id: user_id } });

    if (result.affected === 0) {
      throw new NotFoundException(`No hay artículos en el carrito para eliminar.`);
    }

    return {
      message: 'Todos los artículos han sido eliminados del carrito.',
    };
  }

}
