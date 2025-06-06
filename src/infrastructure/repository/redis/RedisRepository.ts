import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { TTLINSECONDS } from 'src/application/utils/Constants';
import { IRedisRepository } from 'src/domain/repository/redis/IRedisRepository';
import { ConfigService } from '@nestjs/config';
import { DataCardModel } from 'src/domain/entities/DataCard';

@Injectable()
export class RedisRepository implements IRedisRepository {
    private client: Redis;
    constructor(
        private configService: ConfigService
    ) { }
    
    onModuleInit() {
        this.client = new Redis(
            this.configService.get<number>('REDIS_HOST'),
            this.configService.get<string>('REDIS_PORT')
        );
    }

    async saveToken(token: string, data: object, ttlInSeconds = TTLINSECONDS): Promise<void> {
        await this.client.set(token, JSON.stringify(data), 'EX', ttlInSeconds);
    }

    async getTokenData(token: string): Promise<DataCardModel | null> {
        const data = await this.client.get(token);
        return data ? JSON.parse(data) : null;
    }
}
