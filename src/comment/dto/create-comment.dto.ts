import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {
    
    @IsString()
    @IsNotEmpty({ message: 'Es la descripcion en el comentario' })
    descripcion: string;
}
