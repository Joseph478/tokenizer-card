import { Controller, Post, Body, Headers, BadRequestException, Logger, Get, UseFilters } from '@nestjs/common';
import { TokenizerApplicationService } from '../../application/service/TokenizerService';
import { RequestTokenizerDto } from 'src/application/dto/request/RequestDto';
import { ConfigService } from '@nestjs/config';
import { CustomExceptionFilter } from 'src/application/exceptions/ExceptionFilter';


@Controller('data-card')
export class TokenizerController {
    constructor(
        private readonly tokenizerApplicationService: TokenizerApplicationService,
        private configService: ConfigService
    ) { }

    @UseFilters(new CustomExceptionFilter())
    @Post('register')
    async RegisterTokenDataCard(@Body() request: RequestTokenizerDto, @Headers('pk') pk: string): Promise<object> {
        Logger.log(`TokenizerController | RegisterTokenDataCard | request: ${JSON.stringify(request)}`);
        if (!pk) {
            throw new BadRequestException('Header "pk" es requerido');
        }
        if (pk.toString() !== this.configService.get<string>('API_KEY')) {
            throw new BadRequestException('La clave pk es inválida');
        }
        const { payload } = request;
        return this.tokenizerApplicationService.registerDataCard(payload);
    }
    @UseFilters(new CustomExceptionFilter())
    @Get('get-data')
    async GetTokenDataCard(@Headers('authorization') authHeader: string, @Headers('pk') pk: string): Promise<object> {
        Logger.log(`TokenizerController | GetTokenDataCard | authorization: ${authHeader}`);
        if (!pk) {
            throw new BadRequestException('Header "pk" es requerido');
        }
        if (pk.toString() !== this.configService.get<string>('API_KEY')) {
            throw new BadRequestException('La clave pk es inválida');
        }
        const token = authHeader?.replace('Bearer ', '');
        return this.tokenizerApplicationService.getDataCard(token);
    }

}
