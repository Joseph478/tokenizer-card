import { Transform } from 'class-transformer';
import {
    IsEmail,
    Length,
    Matches,
    IsString,
    ValidateIf,
    IsIn,
    IsNumber,
    Validate,
} from 'class-validator';
import { IsLuhnValid } from 'src/application/validation/LuhnValidation';
import { IsExpirationYearValidConstraint } from 'src/application/validation/ExpirationYearValidation';

export class PayloadDto {
    @IsString()
    @Length(5, 100, { message: 'El email debe tener entre 5 y 100 caracteres' })
    @IsEmail({}, { message: 'El email debe ser válido' })
    @Matches(/@(gmail\.com|hotmail\.com|yahoo\.es)$/, {
        message: 'El dominio del email debe ser gmail.com, hotmail.com o yahoo.es',
    })
    email: string;

    @Transform(({ value }) => String(value))
    @Length(13, 16, { message: 'La tarjeta debe tener entre 13 y 16 dígitos' })
    @Matches(/^\d+$/, { message: 'El número de tarjeta debe ser numérico' })
    @IsLuhnValid({ message: 'El número de tarjeta no es válido (Luhn)' })
    card_number: string;

    @Transform(({ value }) => String(value))
    @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
    @Matches(/^\d+$/, { message: 'El CVV debe ser numérico' })
    cvv: string;

    @IsString()
    @Length(2, 2, { message: 'El mes debe tener 2 dígitos' })
    @Matches(/^(0[1-9]|1[0-2])$/, {
        message: 'El mes debe tener 2 dígitos numéricos entre 01 y 12',
    })
    expiration_month: string;

    @IsString()
    @Length(4, 4, { message: 'El año debe tener 4 dígitos' })
    @Matches(/^\d{4}$/, { message: 'El año debe ser un número de 4 dígitos' })
    @Validate(IsExpirationYearValidConstraint)
    expiration_year: string;
}
