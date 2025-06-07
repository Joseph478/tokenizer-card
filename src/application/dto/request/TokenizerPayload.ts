import { Transform } from 'class-transformer';
import {
    IsEmail,
    Length,
    Matches,
    IsString,
    IsDefined,
    Validate,
    IsNumber,
    ValidateIf,
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
    @IsNumber({}, { message: 'El número de tarjeta debe ser un número' })
    card_number: number;

    @ValidateIf((o) => typeof o.card_number === 'number')
    @Length(13, 16, { message: 'La tarjeta debe tener entre 13 y 16 dígitos' })
    @Matches(/^\d+$/, { message: 'El número de tarjeta debe contener solo dígitos' })
    @Validate(IsLuhnValid, { message: 'El número de tarjeta no es válido (Luhn)' })
    get card_number_str(): string {
        return String(this.card_number);
    }

    @IsDefined({ message: 'El CVV es requerido' })
    @IsNumber({}, { message: 'El CVV debe ser un número' })
    cvv: number;

    @ValidateIf((o) => typeof o.cvv === 'number')
    @Length(3, 4, { message: 'El CVV debe tener entre 3 y 4 dígitos' })
    @Matches(/^\d+$/, { message: 'El CVV debe ser numérico' })
    get cvv_str(): string {
        return String(this.cvv);
    }

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
