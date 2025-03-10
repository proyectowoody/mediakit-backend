import { ApiProperty } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  categoria_id: number;
}