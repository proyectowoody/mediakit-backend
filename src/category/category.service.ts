import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);

    return {
      message: 'Categoría creada con éxito',
      category: savedCategory,
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

  async remove(id: number): Promise<{ message: string }> {
    const { category } = await this.findOne(id);
    await this.categoryRepository.remove(category);

    return {
      message: `Categoría eliminada con éxito`,
    };
  }
}
