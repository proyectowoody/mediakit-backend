import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinay/cloudinay.service';
import { ArticleImage } from './entities/articleImage.entity';

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article)
    private readonly articuloRepository: Repository<Article>,
    @InjectRepository(ArticleImage)
    private readonly articleImageRepository: Repository<ArticleImage>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll() {
     const data = await this.articuloRepository.find({
      where: { offer: false },
      relations: ['categoria', 'supplier', 'imagenes'],
    });

    return data;
  }

  async findAllOffers() {
    return this.articuloRepository.find({
      where: { offer: true },
      relations: ['categoria', 'supplier', 'imagenes'],
    });
  }

  async createArticle(article: CreateArticleDto & { imagenes: Express.Multer.File[] }) {
    const articleFound = await this.articuloRepository.findOne({
      where: { nombre: article.nombre },
    });

    if (articleFound) {
      throw new HttpException('El artículo ya existe.', HttpStatus.CONFLICT);
    }

    if (!article.imagenes || article.imagenes.length === 0) {
      throw new HttpException('No se recibieron imágenes para subir.', HttpStatus.BAD_REQUEST);
    }

    const newArticle = this.articuloRepository.create({
      nombre: article.nombre,
      descripcion: article.descripcion,
      categoria: { id: article.categoria_id },
      estado: article.estado,
      precio: article.precio,
      supplier: { id: article.supplier_id },
    });

    await this.articuloRepository.save(newArticle);
    const uploadedImages = [];

    for (const imagen of article.imagenes) {
      const uploadResult = await this.cloudinaryService.uploadFile(imagen);
      if (!uploadResult) {
        throw new HttpException(
          'Error al subir la imagen.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newImage = this.articleImageRepository.create({
        url: uploadResult.secure_url,
        article: newArticle,
      });

      const savedImage = await this.articleImageRepository.save(newImage);
      uploadedImages.push(savedImage);
    }

    return {
      message: 'Artículo creado con éxito',
      article: {
        ...newArticle,
        imagenes: uploadedImages,
      },
    };
  }

  async updateArticle(
    id: any,
    updateArticulo: UpdateArticleDto,
  ): Promise<{ message: string; articulo: Article }> {
    const articulo = await this.articuloRepository.findOne({ where: { id } });
    if (!articulo) {
      throw new NotFoundException(`Artículo no encontrada`);
    }

    const updatedArticulo = Object.assign(articulo, updateArticulo);
    await this.articuloRepository.save(updatedArticulo);
    return {
      message: 'Artículo actualizada con éxito',
      articulo: updatedArticulo,
    };
  }

  async updateArticleDiscount(
    id: any,
    updateArticulo: UpdateArticleDto,
  ): Promise<{ message: string; articulo: Article }> {

    const articulo = await this.articuloRepository.findOne({ where: { id } });
    if (!articulo) {
      throw new NotFoundException(`Artículo no encontrado`);
    }

    if (updateArticulo.discount && updateArticulo.discount > 0) {
      updateArticulo.offer = true;
    } else {
      updateArticulo.offer = false;
    }

    const updatedArticulo = Object.assign(articulo, updateArticulo);

    await this.articuloRepository.save(updatedArticulo);

    return {
      message: 'Artículo actualizado con éxito',
      articulo: updatedArticulo,
    };
  }

  async updateImagen(
    id: any,
    imagen: Express.Multer.File,
  ): Promise<{ message: string; articulo: Article }> {
    const articulo = await this.articuloRepository.findOne({
      where: { id },
      relations: ['imagenes'],
    });

    if (!articulo) {
      throw new NotFoundException(`Artículo no encontrado`);
    }

    if (articulo.imagenes.length > 0) {
      const imagenAEliminar = articulo.imagenes[0];
      const publicId = this.extractPublicId(imagenAEliminar.url);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }

      await this.articleImageRepository.remove(imagenAEliminar);
    }

    const uploadResult = await this.cloudinaryService.uploadFile(imagen);

    const nuevaImagen = this.articleImageRepository.create({
      url: uploadResult.secure_url,
      article: articulo,
    });

    await this.articleImageRepository.save(nuevaImagen);

    return {
      message: 'Imagen actualizada con éxito',
      articulo,
    };
  }

  async removeOffer(id: number): Promise<{ message: string }> {
    const articulo = await this.articuloRepository.findOne({ where: { id } });

    if (!articulo) {
      throw new NotFoundException(`Artículo con id ${id} no encontrado`);
    }

    if (articulo.offer) {
      articulo.offer = false;
      articulo.discount = 0;
      await this.articuloRepository.save(articulo);
      return { message: 'Oferta eliminada del artículo' };
    }

    return { message: 'El artículo no estaba en oferta' };
  }

  private extractPublicId(imageUrl: string): string | null {
    const regex = /\/([^\/]+)\.\w+$/;
    const match = imageUrl.match(regex);
    return match ? match[1] : null;
  }

  async deleteArticle(id: any): Promise<{ message: string }> {
    const articulo = await this.articuloRepository.findOne({
      where: { id },
      relations: ['imagenes'],
    });

    if (!articulo) {
      throw new NotFoundException(`Artículo con id ${id} no encontrado`);
    }

    for (const imagen of articulo.imagenes) {
      const publicId = this.extractPublicId(imagen.url);
      if (publicId) {
        try {
          await this.cloudinaryService.deleteFile(publicId);
        } catch (error) {
          console.error(`Error al eliminar la imagen ${publicId}:`, error);
        }
      }
    }

    await this.articuloRepository.remove(articulo);

    return { message: 'Artículo e imágenes eliminados con éxito' };
  }


}
