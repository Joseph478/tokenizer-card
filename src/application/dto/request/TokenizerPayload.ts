import { Transform } from 'class-transformer';
import {
    IsEmail,
    Length,
    Matches,
    IsString,
    IsDefined,
    Validate,
    IsNumber,
} from 'class-validator';
import { IsLuhnValid } from 'src/application/validation/LuhnValidation';
import { IsExpirationDateValidConstraint } from 'src/application/validation/ExpirationDateValidation';

export class PayloadDto {
    @IsDefined({ message: 'El email es requerido' })
    @IsString({ message: 'El email debe ser string' })
    @Length(5, 100, { message: 'El email debe tener entre 5 y 100 caracteres' })
    @IsEmail({}, { message: 'El email debe ser válido' })
    @Matches(/@(gmail\.com|hotmail\.com|yahoo\.es)$/, {
        message: 'El dominio del email debe ser gmail.com, hotmail.com o yahoo.es',
    })
    email: string;
    
    @IsDefined({ message: 'El número de tarjeta es requerido' })
    @IsNumber({allowNaN: false}, { message: 'El número de tarjeta debe ser un número' })
    @Transform(({ value }) => String(value))
    @Length(13, 16, { message: 'La tarjeta debe tener entre 13 y 16 dígitos' })
    @Matches(/^\d+$/, { message: 'El número de tarjeta debe ser numérico' })
    @IsLuhnValid({ message: 'El número de tarjeta no es válido (Luhn)' })
    card_number: number;
    
    @IsDefined({ message: 'El CVV es requerido' })
    @IsNumber({allowNaN: false}, { message: 'El CVV debe ser un número' })
    @Transform(({ value }) => String(value))
    @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
    @Matches(/^\d+$/, { message: 'El CVV debe ser numérico' })
    cvv: number;
    
    @IsDefined({ message: 'El mes de expiración es requerido' })
    @IsString({ message: 'El mes de expiración debe ser string' })
    @Length(2, 2, { message: 'El mes debe tener 2 dígitos' })
    @Matches(/^(0[1-9]|1[0-2])$/, {
        message: 'El mes debe tener 2 dígitos numéricos entre 01 y 12',
    })
    expiration_month: string;
    
    @IsDefined({ message: 'El año de expiración es requerido' })
    @IsString({ message: 'El año de expiración debe ser string' })
    @Length(4, 4, { message: 'El año debe tener 4 dígitos' })
    @Matches(/^\d{4}$/, { message: 'El año debe ser un número de 4 dígitos' })
    expiration_year: string;
    
    @Validate(IsExpirationDateValidConstraint)
    _expirationDateCheck: string;
}
