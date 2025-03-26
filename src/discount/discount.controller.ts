import { Controller, Post, Body, Get, UseGuards, Patch, Param, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@ApiTags('Descuento')
@Controller('descuento')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) { }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.discountService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() dto: CreateDiscountDto) {
    const result = await this.discountService.create(dto);
    return { message: 'Descuento creado', data: result };
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateDiscountDto) {
    const result = await this.discountService.update(+id, dto);
    return { message: 'Descuento actualizado', data: result };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.discountService.delete(+id);
  }

}
