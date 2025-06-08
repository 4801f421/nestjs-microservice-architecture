// apps/users-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersServiceModule } from './users-service.module';

async function bootstrap() {
    const app = await NestFactory.create(UsersServiceModule);
    const configService = app.get(ConfigService);
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER); // Get logger instance once

    app.useLogger(logger);

    // Connect this application as a microservice using the Redis transporter
    app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
        },
    });

    // --- IMPROVEMENT: Enable graceful shutdown hooks ---
    // This will ensure the app correctly closes database connections and other resources
    // when the process receives a termination signal (e.g., from Docker).
    app.enableShutdownHooks();

    // Start all registered microservices
    await app.startAllMicroservices();

    // Optional: Also listen on an HTTP port
    const httpPort = configService.get('USERS_SERVICE_PORT');
    if (httpPort) {
        await app.listen(httpPort);
        logger.log(`Users microservice is listening on port ${httpPort}...`);
    } else {
        logger.log(
            'Users microservice is running and listening for messages...',
        );
    }
}
bootstrap();
