import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({ description: 'Nombre único del artículo' })
  nombre: string;

  @ApiProperty({ description: 'Descripción del artículo' })
  descripcion: string;

  @ApiProperty({ description: 'ID de la categoría del artículo' })
  categoria_id: number;

  @ApiProperty({ description: 'Estado del artículo (nuevo, usado, etc.)' })
  estado: string;

  @ApiProperty({ description: 'El precio del articulo' })
  precio: number;

  @ApiProperty({
    description: 'Imagen del artículo',
    type: 'string',
    format: 'binary',
  })
  imagen: Express.Multer.File;
}