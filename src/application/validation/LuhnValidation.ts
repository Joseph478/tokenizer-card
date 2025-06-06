import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';

export function IsLuhnValid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isLuhnValid',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return luhnCheck(value);
                },
            },
        });
    };
}

function luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let doubleDigit = false;
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber[i], 10);
        if (doubleDigit) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        doubleDigit = !doubleDigit;
    }
    return sum % 10 === 0;
}
