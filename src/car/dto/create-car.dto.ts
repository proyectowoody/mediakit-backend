import { ApiProperty } from "@nestjs/swagger";

export class CreateCarDto {
    @ApiProperty()
    articulo_id: number;
    @ApiProperty()
    email_user: string;
}
