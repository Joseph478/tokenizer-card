import { Controller, Post, Body, Headers, BadRequestException, Logger, Get, UseFilters } from '@nestjs/common';
import { TokenizerApplicationService } from '../../application/service/TokenizerService';
import { CustomExceptionFilter } from 'src/application/exceptions/ExceptionFilter';
import { ValidateApiKey } from '../../application/validation/ApiKeyValidation'
import { PayloadDto } from 'src/application/dto/request/TokenizerPayload';

@Controller('data-card')
export class TokenizerController {
    constructor(
        private readonly tokenizerApplicationService: TokenizerApplicationService,
    ) { }

    @UseFilters(new CustomExceptionFilter())
    @Post('register')
    @ValidateApiKey()

    async RegisterTokenDataCard(@Body() request: PayloadDto): Promise<object> {
        Logger.log(`TokenizerController | RegisterTokenDataCard | request: ${JSON.stringify(request)}`);
        return this.tokenizerApplicationService.registerDataCard(request);
    }
    @UseFilters(new CustomExceptionFilter())
    @Get('get-data')
    @ValidateApiKey()

    async GetTokenDataCard(@Headers('authorization') authHeader: string): Promise<object> {
        Logger.log(`TokenizerController | GetTokenDataCard | authorization: ${authHeader}`);
        const token = authHeader?.replace('Bearer ', '');
        return this.tokenizerApplicationService.getDataCard(token);
    }

}
