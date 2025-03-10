
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(subcategoriaDto: CreateSubcategoryDto) {
    const subcategoriaFound = await this.subcategoryRepository.findOne({
      where: { nombre: subcategoriaDto.nombre },
    });

    if (subcategoriaFound) {
      throw new HttpException('La subcategoría ya existe.', HttpStatus.CONFLICT);
    }

    const categoria = await this.categoryRepository.findOne({
      where: { id: subcategoriaDto.categoria_id },
    });

    if (!categoria) {
      throw new HttpException('La categoría no existe.', HttpStatus.NOT_FOUND);
    }

    const newSubcategoria = this.subcategoryRepository.create({
      nombre: subcategoriaDto.nombre,
      categoria, 
    });

    await this.subcategoryRepository.save(newSubcategoria);

    return {
      message: 'Subcategoría creada con éxito',
    };
  }

  async findAll(): Promise<Subcategory[]> {
    return await this.subcategoryRepository.find({ relations: ['categoria'] });
  }

  async findOne(id: number): Promise<{ message: string; subcategory: Subcategory }> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id }, relations: ['categoria'] });
    if (!subcategory) {
      throw new NotFoundException(`Subcategoría no encontrada.`);
    }
    return {
      message: 'Subcategoría recuperada con éxito',
      subcategory,
    };
  }

  async update(
    id: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<{ message: string; subcategory: Subcategory }> {
    const subcategory = await this.subcategoryRepository.preload({
      id,
      ...updateSubcategoryDto,
    });
    if (!subcategory) {
      throw new NotFoundException(`Subcategoría no encontrada.`);
    }
    const updatedSubcategory = await this.subcategoryRepository.save(subcategory);
    return {
      message: 'Subcategoría actualizada con éxito',
      subcategory: updatedSubcategory,
    };
  }

  async remove(id: any): Promise<{ message: string }> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id } });

    if (!subcategory) {
      throw new NotFoundException(`Subcategoría no encontrada.`);
    }

    await this.subcategoryRepository.remove(subcategory);

    return { message: 'Subcategoría eliminada con éxito' };
  }
}
