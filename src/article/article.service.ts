import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CloudinaryService } from 'src/cloudinay/cloudinay.service';

@Injectable()
export class ArticleService {

  constructor(
    @InjectRepository(Article)
    private readonly articuloRepository: Repository<Article>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll() {
    return this.articuloRepository.find({
      relations: ['categoria'],
    });
  }

  async createArticle(article: CreateArticleDto) {

    const articleFound = await this.articuloRepository.findOne({
      where: { nombre: article.nombre },
    });

    if (articleFound) {
      throw new HttpException('El artículo ya existe.', HttpStatus.CONFLICT);
    }

    const uploadResult = await this.cloudinaryService.uploadFile(
      article.imagen,
    );

    if (!uploadResult) {
      throw new HttpException(
        'Error al subir la imagen.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const imageUrl = uploadResult.secure_url;

    const newArticle = this.articuloRepository.create({
      ...article,
      imagen: imageUrl,
    });

    await this.articuloRepository.save(newArticle);

    return {
      message: 'Artículo creado con éxito',
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

  private extractPublicId(imageUrl: string): string | null {
    const regex = /\/([^\/]+)\.\w+$/;
    const match = imageUrl.match(regex);
    return match ? match[1] : null;
  }

  async updateImagen(
    id: any,
    imagen: Express.Multer.File,
  ): Promise<{ message: string; articulo: Article }> {
    const articulo = await this.articuloRepository.findOne({ where: { id } });
    if (!articulo) {
      throw new NotFoundException(`Artículo con id ${id} no encontrado`);
    }

    const currentImageUrl = articulo.imagen;
    if (currentImageUrl) {
      const publicId = this.extractPublicId(currentImageUrl);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }
    }

    const uploadResult = await this.cloudinaryService.uploadFile(imagen);

    articulo.imagen = uploadResult.secure_url;

    const updatedArticulo = await this.articuloRepository.save(articulo);

    return {
      message: 'Imagen actualizada con éxito',
      articulo: updatedArticulo,
    };
  }

  async deleteArticle(id: any): Promise<{ message: string }> {
    const articulo = await this.articuloRepository.findOne({ where: { id } });

    if (!articulo) {
      throw new NotFoundException(`Artículo con id ${id} no encontrado`);
    }

    const imageUrl = articulo.imagen;
    const publicId = this.extractPublicId(imageUrl);

    if (publicId) {
      await this.cloudinaryService.deleteFile(publicId);
    }

    await this.articuloRepository.remove(articulo);

    return { message: 'Artículo eliminado con éxito' };
  }

}
