import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from 'src/application/exceptions/ExceptionFilter';

export async function createApp() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            skipMissingProperties: false,
        }),
    );
    app.useGlobalFilters(new CustomExceptionFilter());
    return app;
}

async function bootstrap() {
    const app = await createApp();
    await app.listen(process.env.PORT || 3000);
}

export async function handler() {
    const app = await createApp();
    await app.init();
    return app;
}

if (process.env.NODE_ENV !== 'test') {
    bootstrap();
}