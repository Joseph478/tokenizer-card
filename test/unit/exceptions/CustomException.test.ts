import CustomException from 'src/application/exceptions/CustomException';
import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { CustomExceptionFilter } from 'src/application/exceptions/ExceptionFilter';

describe('CustomException', () => {
    it('debe inicializar correctamente con httpStatus definido', () => {
        const exception = new CustomException({
            message: 'Algo salió mal',
            code: 'ERROR_CODE',
            details: ['detalle 1'],
            httpStatus: 400,
        });

        expect(exception).toBeInstanceOf(CustomException);
        expect(exception.message).toBe('Algo salió mal');
        expect(exception.code).toBe('ERROR_CODE');
        expect(exception.details).toEqual(['detalle 1']);
        expect(exception.httpStatus).toBe(400);
    });

    it('debe usar httpStatus 500 por defecto si no se define', () => {
        const exception = new CustomException({
            httpStatus: 500,
            message: 'Error sin status',
            code: 'DEFAULT_ERROR',
        });

        expect(exception.httpStatus).toBe(500); // cubre getHttpStatus sin parámetro
    });
});

describe('CustomExceptionFilter', () => {
    let mockResponse: any;
    let mockHost: ArgumentsHost;

    beforeEach(() => {
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const switchToHttp = jest.fn().mockReturnValue({
            getResponse: () => mockResponse,
        });

        mockHost = {
            switchToHttp,
        } as any;
    });

    it('debería manejar CustomException', () => {
        const exception = new CustomException({
            code: 'CUSTOM_ERROR',
            message: 'Custom error message',
            httpStatus: 400,
            details: ['Campo inválido'],
        });

        const filter = new CustomExceptionFilter();
        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'CUSTOM_ERROR',
                message: 'Custom error message',
                details: ['Campo inválido'],
                statusCode: 400,
            }),
        );
    });

    it('debería manejar HttpException', () => {
        const exception = new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        const filter = new CustomExceptionFilter();

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'HTTP_EXCEPTION',
                message: 'Bad request',
                statusCode: 400,
            }),
        );
    });

    it('debería manejar Error genérico', () => {
        const exception = new Error('Generic error');
        const filter = new CustomExceptionFilter();

        filter.catch(exception, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'INTERNAL_ERROR',
                message: 'Generic error',
                statusCode: 500,
            }),
        );
    });

    it('debería manejar error desconocido (no Error)', () => {
        const filter = new CustomExceptionFilter();
        const unknown = 'algo raro';

        filter.catch(unknown, mockHost);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                code: 'INTERNAL_ERROR',
                message: 'Internal server error',
                statusCode: 500,
            }),
        );
    });
});