import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { AuthGuard } from 'src/user/guard/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Favorite } from './entities/favorite.entity';

@ApiTags('Favoritos')
@Controller('favorito')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get(':email')
  @UseGuards(AuthGuard)
  async findOne(@Param('email') email: string): Promise<Favorite[]> {
    return this.favoriteService.findOne(email);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() createFavoritoDto: CreateFavoriteDto) {
    return this.favoriteService.create(createFavoritoDto);
  }
  
  @Delete()
  @UseGuards(AuthGuard)
  async remove(
    @Query('articulo_id') articulo_id: number,
    @Query('email_user') email_user: string,
  ): Promise<{ message: string }> {
    
    return this.favoriteService.remove(articulo_id, email_user);
  }
}
