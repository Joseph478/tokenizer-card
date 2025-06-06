import { CanActivate, ExecutionContext, Injectable, BadRequestException, UseGuards, applyDecorators } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
class ApiKeyGuard implements CanActivate {
    constructor(private configService: ConfigService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const apiKey = request.headers['pk'];

        if (!apiKey) {
            throw new BadRequestException('Header "pk" es requerido');
        }

        const expectedKey = this.configService.get<string>('API_KEY');
        if (apiKey !== expectedKey) {
            throw new BadRequestException('La clave pk es inválida');
        }

        return true;
    }
}

export function ValidateApiKey() {
    return applyDecorators(UseGuards(ApiKeyGuard));
}
