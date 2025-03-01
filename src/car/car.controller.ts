import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';

@ApiTags("Carrito")
@Controller('carrito')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Get(':email')
  @UseGuards(AuthGuard)
  async findOne(@Param('email') email: string): Promise<{ articles: any[]; total: number }> {
    return this.carService.findOne(email);
  }

  @Post()
  @UseGuards(AuthGuard)
  carPost(@Body() carDto: CreateCarDto) {
    return this.carService.create(carDto);
  }

  @Get('count/:email')
  @UseGuards(AuthGuard)
  countUserCartItems(@Param('email') email: string) {
    return this.carService.countUserCartItems(email);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async remove(
    @Query('articulo_id') articulo_id: number,
    @Query('email_user') email_user: string,
  ): Promise<{ message: string }> {

    return this.carService.remove(articulo_id, email_user);
  }

}
