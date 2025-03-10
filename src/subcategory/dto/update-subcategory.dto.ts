import { ApiProperty } from "@nestjs/swagger";

export class UpdateSubcategoryDto {
  @ApiProperty()
  nombre?: string;
}