import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateAddressDto {
    
        @IsString()
        @IsNotEmpty({ message: 'La calle es obligatoria' })
        calle?: string;
    
        @IsString()
        @IsNotEmpty({ message: 'El número de vivienda es obligatorio' })
        numero?: string;
    
        @IsString()
        @IsOptional()
        piso_puerta?: string;
    
        @IsNumberString()
        @Length(5, 5, { message: 'El código postal debe tener 5 dígitos' })
        codigo_postal?: string;
    
        @IsString()
        @IsNotEmpty({ message: 'La ciudad es obligatoria' })
        ciudad?: string;
    
        @IsString()
        @IsNotEmpty({ message: 'La provincia es obligatoria' })
        provincia?: string;
    
        @IsString()
        @IsNotEmpty({ message: 'La comunidad autónoma es obligatoria' })
        comunidad_autonoma?: string;
    
        @IsString()
        @IsNotEmpty({ message: 'El país es obligatorio' })
        pais?: string;
}
