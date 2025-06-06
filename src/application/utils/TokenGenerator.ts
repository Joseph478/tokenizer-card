import { randomBytes } from 'crypto';


export async function generateToken(length = 16): Promise<string> {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const bytes = randomBytes(length);
    let token = '';
    for (let i = 0; i < length; i++) {
        token += chars[bytes[i] % chars.length];
    }
    return token;
}