import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplierDto {
    @ApiProperty()
    nombre?: string;
    @ApiProperty()
    descripcion?: string;
}
