import { Inject, Injectable, Logger } from '@nestjs/common';
import { PayloadDto } from 'src/application/dto/request/TokenizerPayload';
import { IRedisRepository } from '../repository/redis/IRedisRepository'
import { DataCard } from '../entities/DataCard';

@Injectable()
export class TokenizerDomainService {
    constructor(
        @Inject('IRedisRepository') private readonly redisRepository: IRedisRepository,
    ) { }

    async registerDataCard(payload: PayloadDto, token: string): Promise<object> {
        Logger.log(`TokenizerDomainService | registerDataCard | payload: ${JSON.stringify(payload)}`);
        Logger.log(`TokenizerDomainService | registerDataCard | token: ${token}`);

        await this.redisRepository.saveToken(token, payload);
        return {
            message: 'Data registered successfully',
            token,
        };
    }

    async getDataCard( token: string): Promise<object> {
        Logger.log(`TokenizerDomainService | registerDataCard | token: ${token}`);
        
        const response = await this.redisRepository.getTokenData(token);
        const dataCard = new DataCard(response);
        Logger.log(`TokenizerDomainService | registerDataCard | response: ${JSON.stringify(response)}`);
        return dataCard.toData();
    }
}
