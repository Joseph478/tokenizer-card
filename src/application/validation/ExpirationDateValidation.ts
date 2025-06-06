import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isExpirationDateValid', async: false })
export class IsExpirationDateValidConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const object = args.object as any;

        const month = parseInt(object.expiration_month, 10);
        const year = parseInt(object.expiration_year, 10);

        if (isNaN(month) || isNaN(year)) return false;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // JS month is 0-indexed

        if (year < currentYear || year > currentYear + 5) return false;

        if (year === currentYear && month < currentMonth) return false;

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        const now = new Date();
        return `La fecha de expiración no puede estar en el pasado. Año debe ser entre ${now.getFullYear()} y ${now.getFullYear() + 5}, y el mes no puede estar vencido.`;
    }
}
