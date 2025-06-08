// apps/auth-service/src/auth/auth.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginDto } from '@app/common';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Listens for the 'login' message pattern from the message broker.
     * This is the entry point for all authentication requests.
     * @param loginDto - The login credentials from the message payload.
     * @returns An object containing the signed access token.
     */
    @MessagePattern({ cmd: 'login' })
    async login(@Payload() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
    @MessagePattern({ cmd: 'verify_token' })
    async verifyToken(@Payload() token: string) {
        return this.authService.verifyToken(token);
    }
}
