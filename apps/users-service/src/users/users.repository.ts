// apps/users-service/src/users/users.repository.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(
        // Inject the User model for the 'users' database connection
        @InjectModel(User.name, 'users') userModel: Model<User>,
    ) {
        // Pass the injected model to the parent AbstractRepository constructor
        super(userModel);
    }

    async findOneWithPassword(
        filterQuery: FilterQuery<User>,
    ): Promise<User | null> {
        // Use .select('+password') to explicitly include the password field
        return this.model.findOne(filterQuery).select('+password');
    }
}
