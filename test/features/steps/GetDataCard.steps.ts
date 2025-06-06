import { loadFeature, defineFeature } from 'jest-cucumber';
import { handler } from '../../../src/infrastructure/bootstrap/App';
import { INestApplication } from '@nestjs/common';
import { TokenizerController } from '../../../src/infrastructure/controllers/TokenizerController';
import { mockGetTokenDataRepository } from '../util/TestHelper';
import { tokenizerRequest } from '../request/RegisterDataCardRequest';
import { tokenizerResponse } from '../response/RegisterDataCardResponse';
import { tokenizerMockData } from '../mock/GetDataCardMock';

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
            try{
                const tokenHeader = `Bearer ${payload}`;
                response = await controller.GetTokenDataCard(tokenHeader);
                console.log('GetDataCard | when | response:', response);
            }catch (error) {
                console.error('GetDataCard | when | error:', error);
            }
        });

        then(/^deberia recibir una respuesta del API (.*)$/, (mensaje: string) => {
            console.log('GetDataCard | then | response:', response);
            console.log('GetDataCard | then | tokenizerResponse:', tokenizerResponse[mensaje.trim()]);
            expect(response).toStrictEqual(tokenizerResponse[mensaje.trim()]);
        });
    });
});