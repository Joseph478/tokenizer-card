import { DataCardModel } from "src/domain/entities/DataCard";

export interface IRedisRepository {
    saveToken(token: string, data: any, ttlInSeconds?: number): Promise<void>;
    getTokenData(token: string): Promise<DataCardModel | null>;
}

