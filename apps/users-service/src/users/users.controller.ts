// apps/users-service/src/users/users.controller.ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from '@app/common';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    /**
     * Listens for messages with the pattern { cmd: 'create_user' }.
     * When a message with this pattern is received from the message broker,
     * this method will be executed.
     * @param createUserDto - The data payload extracted from the message.
     * @returns The result of the service call, which NestJS automatically sends back to the caller.
     */
    @MessagePattern({ cmd: 'create_user' })
    async createUser(@Payload() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    /**
     * Listens for messages with the pattern { cmd: 'get_user' }.
     * @param id - The user ID from the message payload.
     * @returns The found user object.
     */
    @MessagePattern({ cmd: 'get_user' })
    async getUser(@Payload() id: string) {
        return this.usersService.getUser(id);
    }
    
    @MessagePattern({ cmd: 'get_user_by_email' })
    async getUserByEmail(@Payload() email: string) {
        const user = await this.usersService.getUserByEmail(email);
        // We must return the full user object including the password hash here
        // so the auth-service can validate it.
        return user;
    }
}
