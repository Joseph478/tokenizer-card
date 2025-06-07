import { loadFeature, defineFeature } from 'jest-cucumber';
import { handler } from '../../../src/infrastructure/bootstrap/App';
import { INestApplication } from '@nestjs/common';
import { TokenizerController } from '../../../src/infrastructure/controllers/TokenizerController';
import { mockSaveTokenRepository } from '../util/TestHelper';
import { tokenizerRequest } from '../request/RegisterDataCardRequest';
import { tokenizerResponse, tokenTestValue } from '../response/RegisterDataCardResponse';
import * as utils from 'src/application/utils/TokenGenerator';

const feature = loadFeature('test/features/RegisterDataCard.feature');

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

    test('Registrar datos de tarjeta y generar token', ({ given, when, and,  then }) => {
        let payload;
        
        given(/^se envia el payload y el header necesario para la (.*)$/, (peticion: string) => {
            payload = tokenizerRequest[peticion.trim()];
        });
        and('cumple los requisitos', async() => {
            mockSaveTokenRepository(void 0);
            jest.spyOn(utils, 'generateToken').mockResolvedValue(tokenTestValue);

        })

        when('se envía la petición al servicio', async () => {
            response = await controller.RegisterTokenDataCard(payload);
        });

        then(/^deberia recibir una respuesta del API (.*)$/, (mensaje: string) => {
            expect(response).toHaveProperty('token');
            expect(response.token).toMatch(/^[a-zA-Z0-9]{16}$/);
            console.log('RegisterDataCard | then | response:', response);
            console.log('RegisterDataCard | then | tokenizerResponse:', tokenizerResponse[mensaje.trim()]);
            expect(response).toStrictEqual(tokenizerResponse[mensaje.trim()]);
        });
    });

});