// apps/auth-service/src/auth-service.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/auth-service/.env',
            validationSchema: Joi.object({
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.number().required(),
                AUTH_SERVICE_PORT: Joi.number().required(),
            }),
        }),
        LoggerModule,
        AuthModule, // Just import the AuthModule
    ],
})
export class AuthServiceModule {}
