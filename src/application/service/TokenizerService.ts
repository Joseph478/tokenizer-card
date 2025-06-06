import { Injectable, Logger } from '@nestjs/common';
import { TokenizerDomainService } from '../../domain/service/TokenizerService';
import { generateToken } from '../utils/TokenGenerator';
import { PayloadDto } from '../dto/request/TokenizerPayload';


@Injectable()
export class TokenizerApplicationService {
    constructor(private readonly TokenizerDomainService: TokenizerDomainService) { }

    async registerDataCard(payload: PayloadDto): Promise<object> {
        Logger.log(`TokenizerApplicationService | registerDataCard | payload: ${JSON.stringify(payload)}`);
        const tokenGenerator = await generateToken();
        Logger.log(`TokenizerApplicationService | registerDataCard | tokenGenerator: ${tokenGenerator}`);
        
        return this.TokenizerDomainService.registerDataCard(payload, tokenGenerator);
    }
    async getDataCard(token: string): Promise<object> {
        Logger.log(`TokenizerApplicationService | getDataCard | token: ${token}`);
        
        return this.TokenizerDomainService.getDataCard(token);
    }
}
