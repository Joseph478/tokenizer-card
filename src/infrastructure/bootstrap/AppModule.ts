import { Module } from '@nestjs/common';
import { TokenizerModule } from '../controllers/TokenizerModule';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TokenizerModule
    ]
})
export class AppModule { }
