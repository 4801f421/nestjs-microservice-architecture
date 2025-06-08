// apps/api-gateway/src/users/users.controller.ts
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from '@app/common';

@Controller('users')
export class UsersController {
    constructor(
        @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    ) {}

    @Post('sign-up')
    async signUp(@Body() createUserDto: CreateUserDto) {
        return this.usersClient.send({ cmd: 'create_user' }, createUserDto);
    }
}
