import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isExpirationYearValid', async: false })
export class IsExpirationYearValidConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        const year = parseInt(value, 10);
        if (isNaN(year)) return false;

        const currentYear = new Date().getFullYear();
        return year >= currentYear && year <= currentYear + 5;
    }

    defaultMessage(args: ValidationArguments) {
        const currentYear = new Date().getFullYear();
        return `El año debe estar entre ${currentYear} y ${currentYear + 5}`;
    }
}
