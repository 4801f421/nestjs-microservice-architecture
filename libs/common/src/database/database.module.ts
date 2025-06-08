import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

interface DatabaseRegisterOptions {
    // The key of the environment variable that holds the database URI.
    // e.g., 'USERS_DB_URI'
    configKey: string;
    // A unique name for this database connection.
    // This is crucial for working with multiple databases.
    connectionName: string;
}

@Module({})
export class DatabaseModule {
    /**
     * A static method to create a dynamic module for a specific database connection.
     * Each microservice will call this method to configure its database connection.
     * @param options - Configuration options for the database connection.
     * @returns A DynamicModule that configures a Mongoose connection.
     */
    static register({
        configKey,
        connectionName,
    }: DatabaseRegisterOptions): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                MongooseModule.forRootAsync({
                    // Use the provided connection name.
                    connectionName,
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                        // Get the specific database URI using the provided config key.
                        uri: configService.get<string>(configKey),
                    }),
                }),
            ],
            // We don't need to export anything here because MongooseModule handles it.
        };
    }
}
