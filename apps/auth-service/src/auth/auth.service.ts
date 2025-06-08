// apps/auth-service/src/auth/auth.service.ts
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '@app/common';

@Injectable()
export class AuthService {
    constructor(
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        try {
            const user = await firstValueFrom(
                this.usersClient.send(
                    { cmd: 'get_user_by_email' },
                    loginDto.email,
                ),
            );

            if (!user) {
                // Correct way to throw an error from a microservice
                throw new RpcException({
                    message: 'Invalid credentials.',
                    status: HttpStatus.UNAUTHORIZED,
                });
            }

            const isPasswordMatch = await bcrypt.compare(
                loginDto.password,
                user.password,
            );

            if (!isPasswordMatch) {
                // Correct way to throw an error from a microservice
                throw new RpcException({
                    message: 'Invalid credentials.',
                    status: HttpStatus.UNAUTHORIZED,
                });
            }

            const payload = {
                sub: user._id,
                email: user.email,
                plan: user.plan,
                roles: user.roles,
            };

            const accessToken = this.jwtService.sign(payload);
            return { accessToken };
        } catch (error) {
            // If the error is already an RpcException, re-throw it.
            if (error instanceof RpcException) {
                throw error;
            }
            // For any other unexpected errors, wrap them in a generic RpcException.
            throw new RpcException({
                message: 'An internal error occurred.',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async verifyToken(token: string) {
        try {
            const payload = await this.jwtService.verifyAsync(token);
            return payload;
        } catch (error) {
            throw new RpcException({
                message: 'Token is not valid.',
                status: HttpStatus.UNAUTHORIZED,
            });
        }
    }
}
