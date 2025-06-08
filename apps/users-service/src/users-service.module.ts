// apps/users-service/src/users-service.module.ts
import { Module } from '@nestjs/common';
import { DatabaseModule, LoggerModule } from '@app/common';
import { UsersModule } from './users/users.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        // It's best practice to list the main ConfigModule first,
        // as other modules depend on the services it provides.
        NestConfigModule.forRoot({
            isGlobal: true,
            envFilePath: './apps/users-service/.env',
            validationSchema: Joi.object({
                USERS_DB_URI: Joi.string().required(),
                REDIS_HOST: Joi.string().required(),
                REDIS_PORT: Joi.number().required(),
                USERS_SERVICE_PORT: Joi.number().required(),
            }),
        }),
        LoggerModule,
        DatabaseModule.register({
            configKey: 'USERS_DB_URI',
            connectionName: 'users',
        }),
        UsersModule,
    ],
    controllers: [],
    providers: [],
})
export class UsersServiceModule {}
