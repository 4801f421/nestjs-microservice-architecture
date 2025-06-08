import { Injectable, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from '@app/common';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(
                createUserDto.password,
                saltRounds,
            );

            const userDocument = await this.usersRepository.create({
                email: createUserDto.email,
                password: hashedPassword,
            });

            const userObject = userDocument.toJSON();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...result } = userObject;
            return result;
        } catch (error) {
            // --- IMPROVEMENT 1: Handle specific database errors ---
            // MongoDB's duplicate key error code is 11000
            if (error.code === 11000) {
                throw new RpcException({
                    message: 'A user with this email already exists.',
                    status: HttpStatus.CONFLICT, // 409
                });
            }
            // For other errors, throw a generic internal error
            throw new RpcException({
                message: 'An internal error occurred in the users service.',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            });
        }
    }

    async getUser(id: string): Promise<Partial<User>> {
        // This method implicitly relies on the repository to throw if not found.
        const userDocument = await this.usersRepository.findOne({ _id: id });
        return userDocument.toJSON();
    }

    /**
     * Finds a user by email, including their password.
     * This method now expects the repository to always return a user or throw.
     * @param email The user's email.
     * @returns The full user document.
     */
    async getUserByEmail(email: string): Promise<User> {
        // --- IMPROVEMENT 2: Correct return type and rely on repository's error handling ---
        // The repository will throw an RpcException if not found, which will be propagated.
        return this.usersRepository.findOneWithPassword({ email });
    }
}
