// apps/api-gateway/src/auth/auth.controller.ts
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApplyRateLimit, LoginDto } from '@app/common';

@Controller('auth')
export class AuthController {
    // Inject the client proxy for the auth microservice
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    @Post('login')
    @ApplyRateLimit('authProtection') // Apply our predefined rate limit profile
    async login(@Body() loginDto: LoginDto) {
        // Send a message with a specific pattern to the auth-service
        // and return the response to the client.
        return this.authClient.send({ cmd: 'login' }, loginDto);
    }
}
