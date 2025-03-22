import { IsEmail, IsString } from "class-validator";

export class CreateCashDto {
    @IsString()
    cash: string;
    @IsEmail()
    email: string;
}
