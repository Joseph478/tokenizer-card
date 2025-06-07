import { validate } from "class-validator";
import { PayloadDto } from "src/application/dto/request/TokenizerPayload";
import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyGuard } from "src/application/validation/ApiKeyValidation";
import { payloadRequest } from "../request/PayloadRequest";


describe('PayloadDto - cvv_str y validaciones', () => {
    it('valida correctamente cuando cvv es un número de 3 dígitos', async () => {
        const dto = new PayloadDto();
        const {requestOk} = payloadRequest;

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
        const cvvStrError = errors.find(e => e.property === 'cvv_str');
        expect(cvvStrError).toBeDefined();
    });
});

describe('ApiKeyGuard', () => {
    let guard: ApiKeyGuard;
    let mockConfigService: Partial<ConfigService>;

    const createMockContext = (headers: Record<string, string | undefined>): ExecutionContext => {
        return {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers,
                }),
            }),
        } as unknown as ExecutionContext;
    };

    beforeEach(() => {
        mockConfigService = {
            get: jest.fn(),
        };
        guard = new ApiKeyGuard(mockConfigService as ConfigService);
    });

    it('lanza excepción si no hay header pk', () => {
        const context = createMockContext({});
        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
        expect(() => guard.canActivate(context)).toThrow('Header "pk" es requerido');
    });

    it('lanza excepción si la clave pk es incorrecta', () => {
        mockConfigService.get = jest.fn().mockReturnValue('clave_valida');
        const context = createMockContext({ pk: 'clave_incorrecta' });

        expect(() => guard.canActivate(context)).toThrow(BadRequestException);
        expect(() => guard.canActivate(context)).toThrow('La clave pk es inválida');
    });

    it('permite acceso si la clave pk es válida', () => {
        mockConfigService.get = jest.fn().mockReturnValue('clave_valida');
        const context = createMockContext({ pk: 'clave_valida' });

        const result = guard.canActivate(context);
        expect(result).toBe(true);
    });
});
