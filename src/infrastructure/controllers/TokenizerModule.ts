import { Module } from '@nestjs/common';
import { TokenizerController } from './TokenizerController';
import { TokenizerDomainService } from '../../domain/service/TokenizerService';
import { TokenizerApplicationService } from '../../application/service/TokenizerService';
import { RedisRepository } from '../repository/redis/RedisRepository';

@Module({
    imports: [],
    controllers: [TokenizerController],
    providers: [
        TokenizerApplicationService,
        TokenizerDomainService,
        {
            provide: 'IRedisRepository',
            useClass: RedisRepository,
        }
    ],
})

export class TokenizerModule {}
