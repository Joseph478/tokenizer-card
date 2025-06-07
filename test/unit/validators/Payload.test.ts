import { validate } from "class-validator";
import { PayloadDto } from "src/application/dto/request/TokenizerPayload";
import { payloadRequest } from "../request/PayloadRequest";


describe('PayloadDto validaciones', () => {
    it('valida correctamente cuando cvv es un número de 3 dígitos', async () => {
        const {requestOk} = payloadRequest;
        const dto = new PayloadDto();
        dto.card_number = requestOk.card_number;
        dto.cvv = requestOk.cvv;
        dto.expiration_month = requestOk.expiration_month;
        dto.expiration_year = requestOk.expiration_year;
        dto.email = requestOk.email;
        
        const errors = await validate(dto);
        expect(errors.length).toBe(0);
    });

    it('convierte el CVV a string con getter', () => {
        const dto = new PayloadDto();
        dto.cvv = 456;

        const str = dto.cvv_str;
        expect(str).toBe('456');
    });

    it('falla si el CVV es un string', async () => {
        const dto: any = new PayloadDto();
        dto.cvv = '123';

        const errors = await validate(dto);
        expect(errors.length).toBeGreaterThan(0);
    });

    it('falla si el CVV tiene menos de 3 dígitos', async () => {
        const dto = new PayloadDto();
        dto.cvv = 1;

        const errors = await validate(dto);
        expect(errors.some(e => e.property === 'cvv_str')).toBe(true);
    });
});
