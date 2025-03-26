import { IsString, IsOptional, IsNotEmpty, IsNumberString, Length, IsBoolean } from 'class-validator';

export class CreateAddressDto {

  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio' })
  pais: string;

  @IsString()
  @IsNotEmpty({ message: 'La provincia es obligatoria' })
  provincia: string;

  @IsString()
  @IsNotEmpty({ message: 'La localidad es obligatoria' })
  localidad: string;

  @IsNumberString()
  @Length(5, 5, { message: 'El código postal debe tener 5 dígitos' })
  codigo_postal: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo de vía y nombre es obligatorio' })
  tipo_via: string;

  @IsBoolean()
  envio: boolean;

  @IsBoolean()
  facturacion: boolean;

  @IsString()
  @IsOptional()
  adicional?: string;

  @IsString()
  @IsOptional()
  indicacion?: string;
}
