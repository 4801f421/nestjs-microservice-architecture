import { Controller } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/common';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @MessagePattern({ cmd: 'create_user' })
    async createUser(@Payload() createUserDto: CreateUserDto) {
        try {
            return await this.usersService.create(createUserDto);
        } catch (error) {
            // Re-throw the exception to ensure it propagates back to the caller (API Gateway).
            if (error instanceof RpcException) {
                throw error;
            }
            // For any unexpected errors, wrap them in a generic RpcException.
            throw new RpcException(
                'An internal error occurred in the users controller.',
            );
        }
    }

    @MessagePattern({ cmd: 'get_user' })
    async getUser(@Payload() id: string) {
        try {
            return await this.usersService.getUser(id);
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException('An internal error occurred.');
        }
    }

    @MessagePattern({ cmd: 'get_user_by_email' })
    async getUserByEmail(@Payload() email: string) {
        try {
            const user = await this.usersService.getUserByEmail(email);
            return user;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException('An internal error occurred.');
        }
    }
}
