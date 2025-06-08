// apps/users-service/src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from '@app/common';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(
            createUserDto.password,
            saltRounds,
        );

        const userDocument = await this.usersRepository.create({
            email: createUserDto.email,
            password: hashedPassword,
        });

        // The service layer's responsibility is to map the rich document to a safe, plain object.
        const userObject = userDocument.toJSON();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = userObject;
        return result;
    }

    async getUser(id: string): Promise<Partial<User>> {
        const userDocument = await this.usersRepository.findOne({ _id: id });
        // The password is not selected due to `select: false` in the schema
        return userDocument.toJSON();
    }
    async getUserByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOneWithPassword({ email });
    }
}
