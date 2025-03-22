import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/user/guard/auth.guard';

@ApiTags("Carrito")
@Controller('carrito')
export class CarController {
  constructor(private readonly carService: CarService) { }

  @Get()
  @UseGuards(AuthGuard)
  async findOne(@Request() req): Promise<{ articles: any[]; total: number }> {
    const email = req.user.email;
    return this.carService.findOne(email);
  }

  @Post()
  @UseGuards(AuthGuard)
  carPost(@Request() req, @Body() body: { articulo_id: number }) {
    const email = req.user.email;
    return this.carService.create({articulo_id: body.articulo_id, email_user: email });
  }

  @Get('/count')
  @UseGuards(AuthGuard)
  countUserCartItems(@Request() req) {
    const email = req.user.email;
    return this.carService.countUserCartItems(email);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async remove(
    @Query('articulo_id') articulo_id: number, @Request() req
  ): Promise<{ message: string }> {
    const email_user = req.user.email;
    return this.carService.remove(articulo_id, email_user);
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  async removeCartArticle(
    @Query('dat') dat: string,
    @Query('articulo_id') articulo_id: number,
    @Request() req
  ) {
    const email_user = req.user.email;
    return this.carService.removeCartArticle(articulo_id, dat, email_user);
  }
}
