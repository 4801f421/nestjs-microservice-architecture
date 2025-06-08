// apps/auth-service/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices'; // Import these
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        // --- FIX IS HERE: Move ClientsModule into this feature module ---
        ClientsModule.registerAsync([
            {
                name: 'USERS_SERVICE',
                useFactory: (configService: ConfigService) => ({
                    transport: Transport.REDIS,
                    options: {
                        host: configService.get<string>('REDIS_HOST'),
                        port: configService.get<number>('REDIS_PORT'),
                    },
                }),
                inject: [ConfigService],
            },
        ]),
        JwtModule.registerAsync({
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get<string>('JWT_EXPIRATION')}`,
                },
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
