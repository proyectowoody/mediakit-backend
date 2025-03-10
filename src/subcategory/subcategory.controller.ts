
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';

@ApiTags("Subcategorias")
@Controller('subcategorias')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) { }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() newSubcategory: CreateSubcategoryDto) {
    return await this.subcategoryService.create(newSubcategory);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.subcategoryService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.subcategoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateSubcategoryDto: UpdateSubcategoryDto) {
    return this.subcategoryService.update(+id, updateSubcategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.subcategoryService.remove(+id);
  }
}
