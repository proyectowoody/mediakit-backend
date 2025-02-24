import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty({ description: 'Nombre único del artículo a actualizar', required: false })
  nombre?: string;

  @ApiProperty({ description: 'Nueva descripción del artículo', required: false })
  descripcion?: string;

  @ApiProperty({ description: 'ID de la categoría del artículo', required: false })
  categoria_id?: number;

  @ApiProperty({ description: 'Estado del artículo (nuevo, usado, etc.)', required: false })
  estado?: string;

  @ApiProperty({ description: 'El precio del articulo' })
  precio: number;

  @ApiProperty({
    description: 'Nueva imagen del artículo',
    type: 'string',
    format: 'binary',
    required: false,
  })
  imagen?: Express.Multer.File;
}