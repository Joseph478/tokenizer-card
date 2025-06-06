import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import { ValidationPipe } from '@nestjs/common';
import { CustomExceptionFilter } from 'src/application/exceptions/ExceptionFilter';

async function bootstrap() {
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
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
