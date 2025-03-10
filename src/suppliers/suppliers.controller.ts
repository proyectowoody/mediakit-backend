import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Supplier")
@Controller('supplier')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @UploadedFile() imagen: Express.Multer.File,
    @Body() newSupplier: CreateSupplierDto,
  ) {
    return await this.suppliersService.create({
      ...newSupplier,
      imagen,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get('count')
  async countArticles() {
    return this.suppliersService.countSup();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateSupplierDto) {
    return this.suppliersService.update(+id, updateCategoryDto);
  }

  @Patch(':id/imagen')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('imagen'))
  async updateImagen(
    @Param('id') id: string,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    return this.suppliersService.updateImagen(id, imagen);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(+id);
  }

}
