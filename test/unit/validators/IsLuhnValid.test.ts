import { validate } from 'class-validator';
import { IsLuhnValid } from 'src/application/validation/LuhnValidation';

class TestCardDto {
    @IsLuhnValid({ message: 'Tarjeta inválida' })
    cardNumber: string;
}

describe('IsLuhnValid', () => {
    it('debería validar correctamente un número válido', async () => {
        const dto = new TestCardDto();
        dto.cardNumber = '4111111111111111'; // válido por algoritmo de Luhn

        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('debería fallar para un número inválido', async () => {
        const dto = new TestCardDto();
        dto.cardNumber = '1234567890123456'; // inválido

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toHaveProperty('isLuhnValid');
        expect(errors[0].constraints?.isLuhnValid).toBe('Tarjeta inválida');
    });

    it('debería fallar si no se proporciona número', async () => {
        const dto = new TestCardDto();
        dto.cardNumber = '';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });
});
