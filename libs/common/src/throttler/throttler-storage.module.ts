// libs/common/src/throttler/throttler.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

export const THROTTLER_STORAGE_SERVICE = 'THROTTLER_STORAGE_SERVICE';

@Module({
    providers: [
        {
            provide: THROTTLER_STORAGE_SERVICE,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return new ThrottlerStorageRedisService({
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                });
            },
        },
    ],
    exports: [THROTTLER_STORAGE_SERVICE],
})
export class ThrottlerStorageModule {} // Renamed for clarity
