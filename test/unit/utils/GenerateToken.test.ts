import { generateToken } from 'src/application/utils/TokenGenerator';

describe('generateToken', () => {
    it('debe generar un token con longitud por defecto de 16', async () => {
        const token = await generateToken();
        expect(typeof token).toBe('string');
        expect(token.length).toBe(16);
        expect(token).toMatch(/^[a-zA-Z0-9]+$/);
    });

    it('debe generar un token de longitud personalizada', async () => {
        const token = await generateToken(24);
        expect(token.length).toBe(24);
        expect(token).toMatch(/^[a-zA-Z0-9]+$/);
    });
});
