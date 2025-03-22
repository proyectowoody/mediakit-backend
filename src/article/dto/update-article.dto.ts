import { ApiProperty } from '@nestjs/swagger';

export class UpdateArticleDto {
  @ApiProperty({ description: 'Nombre único del artículo' })
  nombre?: string;

  @ApiProperty({ description: 'Descripción del artículo' })
  descripcion?: string;

  @ApiProperty({ description: 'ID de la categoría del artículo' })
  categoria_id?: number;

  @ApiProperty({ description: 'ID del proveedor del artículo' })
  supplier_id?: number;

  @ApiProperty({ description: 'Estado del artículo (nuevo, usado, etc.)' })
  estado?: string;

  @ApiProperty({ description: 'El precio del artículo' })
  precio?: number;

  @ApiProperty({ description: 'Indica si el artículo está en oferta', default: false })
  offer?: boolean;

  @ApiProperty({ description: 'Descuento en porcentaje si está en oferta', required: false })
  discount?: number;

  @ApiProperty({
    description: 'Nuevas imágenes a subir',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  imagenes?: Express.Multer.File[];
}
