import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CloudinaryService } from 'src/cloudinay/cloudinay.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async create(categoria: CreateCategoryDto) {

    const categoriaFound = await this.categoryRepository.findOne({
      where: { nombre: categoria.nombre },
    });

    if (categoriaFound) {
      throw new HttpException('La categoría ya existe.', HttpStatus.CONFLICT);
    }

    const uploadResult = await this.cloudinaryService.uploadFile(
      categoria.imagen,
    );

    if (!uploadResult) {
      throw new HttpException(
        'Error al subir la imagen.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const imageUrl = uploadResult.secure_url;

    const newCategoria = this.categoryRepository.create({
      ...categoria,
      imagen: imageUrl,
    });

    await this.categoryRepository.save(newCategoria);

    return {
      message: 'Categoría creada con éxito',
    };
  }


  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<{ message: string; category: Category }> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoría no encontrada.`);
    }
    return {
      message: 'Categoría recuperada con éxito',
      category,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoryRepository.preload({
      id,
      ...updateCategoryDto,
    });
    if (!category) {
      throw new NotFoundException(`Categoría no encontrada.`);
    }
    const updatedCategory = await this.categoryRepository.save(category);
    return {
      message: 'Categoría actualizada con éxito',
      category: updatedCategory,
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
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoria no encontrado`);
    }

    const currentImageUrl = category.imagen;
    if (currentImageUrl) {
      const publicId = this.extractPublicId(currentImageUrl);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }
    }

    const uploadResult = await this.cloudinaryService.uploadFile(imagen);

    category.imagen = uploadResult.secure_url;

    const updatedCategory = await this.categoryRepository.save(category);

    return {
      message: 'Imagen actualizada con éxito',
      category: updatedCategory,
    };
  }

  async remove(id: any): Promise<{ message: string }> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Categoría no encontrado`);
    }

    const imageUrl = category.imagen;
    const publicId = this.extractPublicId(imageUrl);

    if (publicId) {
      await this.cloudinaryService.deleteFile(publicId);
    }

    await this.categoryRepository.remove(category);

    return { message: 'Artículo eliminado con éxito' };
  }
}
