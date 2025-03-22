import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogDto  {
  @ApiProperty({ description: 'Título del blog media kit', maxLength: 10 })
  titulo: string;

  @ApiProperty({ description: 'Descripción del blog media kit' })
  descripcion: string;

  @ApiProperty({ description: 'Slug único del blog media kit', maxLength: 10 })
  slug: string;

  @ApiProperty({ description: 'Categoría del blog media kit', maxLength: 10 })
  categoria: string;

  @ApiProperty({ description: 'Contenido del blog media kit' })
  contenido: string;

  @ApiProperty({
    description: 'Imágenes asociadas al blog media kit',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  imagenes: Express.Multer.File[];
}
