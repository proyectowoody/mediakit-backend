import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { DiscountService } from 'src/discount/discount.service';

@Injectable()
export class CarService {

  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly userService: UserService,
    private readonly discoutService: DiscountService
  ) { }

  async UpdateCar(data: { codigo: string; email_user: string }) {

    const { codigo, email_user } = data;

    const descuento = await this.discoutService.findByCodigo(codigo);
    if (!descuento) {
      throw new Error('Código de descuento inválido');
    }

    const user = await this.userService.findByEmail(email_user);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const carItems = await this.carRepository.find({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    if (carItems.length === 0) {
      throw new Error('No hay artículos en el carrito');
    }

    for (const item of carItems) {
      item.discount = descuento.descuento;
      await this.carRepository.save(item);
    }

    return { message: 'Descuento aplicado correctamente', descuento: descuento.descuento };
  }

  async findOne(email: string): Promise<{ articles: any[]; total: number; descuentoAplicado: number }> {
    const user = await this.userService.findByEmail(email);
    const user_id = user.id;

    const cars = await this.carRepository.find({
      where: { user: { id: user_id } },
      relations: ['user', 'article', 'article.imagenes'],
    });

    const groupedArticles = new Map<number, any>();
    let total = 0;
    let descuento = 0;

    cars.forEach(car => {
      const article = car.article;
      const articleId = article.id;

      const finalPrice = article.precioActual;

      total += finalPrice;

      if (car.discount && car.discount > 0 && descuento === 0) {
        descuento = car.discount;
      }

      if (!groupedArticles.has(articleId)) {
        groupedArticles.set(articleId, {
          article: {
            id: article.id,
            nombre: article.nombre,
            descripcion: article.descripcion,
            fecha: article.fecha,
            estado: article.estado,
            precio: article.precio,
            precioAct: article.precioActual,
            discount: article.discount,
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

    const montoDescontado = (total * descuento) / 100;
    const totalConDescuento = total - montoDescontado;

    return {
      articles: formattedCars,
      total: totalConDescuento,
      descuentoAplicado: descuento,
    };
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
      fecha: new Date().toISOString(),
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

  async findAbandonedCarts(): Promise<{ userEmail: string; articles: any[] }[]> {
    const allCarts = await this.carRepository.find({ relations: ['user', 'article', 'article.imagenes'] });

    const ahoraUTC = new Date();
    ahoraUTC.setHours(ahoraUTC.getHours() - 1);

    const cartsFiltered = allCarts.filter(car => {
      const carritoFecha = new Date(car.fecha);
      const segundosTranscurridos = Math.floor((ahoraUTC.getTime() - carritoFecha.getTime()) / 1000);

      return segundosTranscurridos >= 3600;
    });

    const groupedUsers = new Map<string, { userEmail: string; articles: any[] }>();

    cartsFiltered.forEach(car => {
      const userEmail = car.user?.email || "desconocido";
      const article = car.article;

      if (!groupedUsers.has(userEmail)) {
        groupedUsers.set(userEmail, {
          userEmail,
          articles: [],
        });
      }

      groupedUsers.get(userEmail)!.articles.push({
        id: article.id,
        nombre: article.nombre,
        descripcion: article.descripcion,
        precio: article.precio,
        imagenes: article.imagenes?.map(img => img.url) || [],
      });
    });

    return Array.from(groupedUsers.values());
  }

  @Cron('0 0 * * *')
  async handleAbandonedCarts() {
    const abandonedCarts = await this.findAbandonedCarts();
    const emails = abandonedCarts.map(cart => cart.userEmail);

    for (const email of emails) {
      const Usuario = { email };
      await this.userService.envioEmail(Usuario, email, 'car');
    }
  }

  async removeCartArticle(
    articulo_id: number,
    dat: string,
    email_user: string
  ): Promise<{ message: string }> {

    const user = await this.userService.findByEmail(email_user);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    const user_id = user.id;

    if (dat === '+1') {
      await this.create({ articulo_id, email_user });
      return { message: 'Artículo agregado al carrito.' };
    }

    if (dat === '-1') {
      const existingItem = await this.carRepository.findOne({
        where: {
          article: { id: articulo_id },
          user: { id: user_id },
        },
        order: { fecha: 'ASC' },
      });

      if (!existingItem) {
        throw new NotFoundException('No se encontró una unidad del artículo en el carrito.');
      }

      await this.carRepository.remove(existingItem);
      return { message: 'Una unidad del artículo fue eliminada del carrito.' };
    }

    throw new BadRequestException('Operación inválida. Solo se permite +1 o -1.');
  }

}
