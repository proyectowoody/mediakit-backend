import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCommentarticleDto {
    @ApiProperty()
    articulo_id: number;
    @ApiProperty()
    comentario: string;
}
