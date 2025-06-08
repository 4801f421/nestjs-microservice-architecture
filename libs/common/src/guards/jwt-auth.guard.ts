// libs/common/src/guards/jwt-auth.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization token found.');
        }

        const token = authHeader.split(' ')[1];

        try {
            const userPayload = await firstValueFrom(
                this.authClient.send({ cmd: 'verify_token' }, token),
            );
            request.user = userPayload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired token.');
        }
    }
}
