// apps/api-gateway/src/api-gateway.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
    ConfigModule as NestConfigModule,
    ConfigService,
} from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import * as Joi from 'joi';
import { LoggerModule, SimpleThrottlerGuard } from '@app/common'; // Import our new simple guard
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ThrottlerModule as NestThrottlerModule } from '@nestjs/throttler';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/api-gateway/.env',
            validationSchema: Joi.object({
                API_GATEWAY_PORT: Joi.number().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.number().required(),
            }),
        }),
        NestThrottlerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                storage: new ThrottlerStorageRedisService({
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                }),
                // A simple, global default rule. Our guard's getTracker will make it smart.
                throttlers: [{ limit: 100, ttl: 60000 }], // 100 requests per minute
            }),
        }),
        LoggerModule,
        AuthModule,
        UsersModule,
    ],
    providers: [
        // Apply our simple throttler guard globally.
        {
            provide: APP_GUARD,
            useClass: SimpleThrottlerGuard,
        },
    ],
})
export class ApiGatewayModule {}
