import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCommentDto {
    @IsString()
    @IsNotEmpty({ message: 'Es la descripcion en el comentario' })
    descripcion: string;
}
