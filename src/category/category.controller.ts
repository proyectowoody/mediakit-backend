import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags("Categorías")
@Controller('categorias')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @UploadedFile() imagen: Express.Multer.File,
    @Body() newCategory: CreateCategoryDto,
  ) {
    return await this.categoryService.create({
      ...newCategory,
      imagen,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get("/subcategorias")
  findAllSubcategorias() {
    return this.categoryService.findAllSub();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Patch(':id/imagen')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  async updateImagen(
    @Param('id') id: string,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    return this.categoryService.updateImagen(id, imagen);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
