import { loadFeature, defineFeature } from 'jest-cucumber';
import { handler } from '../../../src/infrastructure/bootstrap/App';
import { INestApplication } from '@nestjs/common';
import { TokenizerController } from '../../../src/infrastructure/controllers/TokenizerController';
import { mockGetTokenDataRepository } from '../util/TestHelper';
import { tokenizerRequest } from '../request/GetDataCardRequest';
import { tokenizerResponse } from '../response/GetDataCardResponse';
import { tokenizerMockData, tokenizerMockData2 } from '../mock/GetDataCardMock';
import CustomException from 'src/application/exceptions/CustomException';
import { ERROR_CARD000002 } from 'src/application/exceptions/ErrorConstants';

const feature = loadFeature('test/features/GetDataCard.feature');

defineFeature(feature, (test) => {
    let app: INestApplication;
    let controller: TokenizerController;
    let response;

    beforeAll(async () => {
        app = await handler();
        controller = app.get(TokenizerController);
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
        process.env.NODE_ENV = 'development';
    });

    beforeEach(() => {
        jest.resetAllMocks();
        response = undefined;
    });

    test('Obtener datos de tarjeta y token', ({ given, when, and,  then }) => {
        let payload;
        
        given(/^se envia el token y header necesario para la (.*)$/, (peticion: string) => {
            payload = tokenizerRequest[peticion.trim()];
        });
        and('cumple los requisitos', async() => {
            mockGetTokenDataRepository(tokenizerMockData);
        })

        when('se envía la petición al servicio', async () => {
                const tokenHeader = `Bearer ${payload}`;
                response = await controller.GetTokenDataCard(tokenHeader);
                console.log('GetDataCard | when | response:', response);
        });

        then(/^deberia recibir una respuesta del API (.*)$/, (mensaje: string) => {
            console.log('GetDataCard | then | response:', response);
            console.log('GetDataCard | then | tokenizerResponse:', tokenizerResponse[mensaje.trim()]);
            expect(response).toStrictEqual(tokenizerResponse[mensaje.trim()]);
        });
    });

    test('Obtener datos de tarjeta vencida', ({ given, when, and,  then }) => {
        let payload;
        
        given(/^se envia el token y header necesario para la (.*)$/, (peticion: string) => {
            payload = tokenizerRequest[peticion.trim()];
        });
        and('cumple los requisitos', async() => {
            mockGetTokenDataRepository(tokenizerMockData2);
        })

        when('se envía la petición al servicio', async () => {
            try{
                const tokenHeader = `Bearer ${payload}`;
                response = await controller.GetTokenDataCard(tokenHeader);
                console.log('GetDataCard | when | validation | response:', response);
            }catch (error) {
                console.error('GetDataCard | when | validation | error:', error);
                response = error;
            }
        });

        then('deberia validar la respuesta del API', () => {
            console.log('GetDataCard | then | validation | response:', response);
            expect(response).toBeInstanceOf(CustomException);
			expect(response.message).toEqual(ERROR_CARD000002.message);
			expect(response.httpStatus).toEqual(ERROR_CARD000002.httpStatus);
			expect(response.code).toEqual(ERROR_CARD000002.code);
			expect(response.details).toEqual("La tarjeta con fecha de expiración 06/2024 es inválida");
        });
    });
});