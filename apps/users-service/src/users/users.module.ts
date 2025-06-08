// apps/users-service/src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [
        // This registers the User model with Mongoose.
        // It makes the UserModel available for injection within this module's scope.
        MongooseModule.forFeature(
            [{ name: User.name, schema: UserSchema }],
            'users', // IMPORTANT: This name MUST match the connectionName from DatabaseModule.register()
        ),
    ],
    controllers: [UsersController],
    // We list the services and repositories as providers so NestJS can manage their instantiation and dependencies.
    providers: [UsersService, UsersRepository],
    // We export UsersService so it can be used by other services within this microservice if needed.
    exports: [UsersService],
})
export class UsersModule {}
