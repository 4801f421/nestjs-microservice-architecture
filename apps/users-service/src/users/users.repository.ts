import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { User } from './schemas/user.schema';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(@InjectModel(User.name, 'users') userModel: Model<User>) {
        super(userModel);
    }

    /**
     * Finds a single user by a given query, including their password hash.
     * Throws a structured RpcException if the user is not found.
     * @param filterQuery - The query to find the user.
     * @returns The full Mongoose user document including the password.
     */
    async findOneWithPassword(filterQuery: FilterQuery<User>): Promise<User> {
        const document = await this.model
            .findOne(filterQuery)
            .select('+password');
        // By handling the "not found" case here, we make the repository's contract stronger.
        if (!document) {
            this.logger.warn(
                'User not found with filterQuery in findOneWithPassword',
                filterQuery,
            );
            // Throw a standard error that our AllExceptionsFilter can handle.
            throw new RpcException({
                message: 'User not found.',
                status: HttpStatus.NOT_FOUND,
            });
        }

        return document;
    }
}
