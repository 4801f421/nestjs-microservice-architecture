// apps/users-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { UsersServiceModule } from './users-service.module';

async function bootstrap() {
    // Create a full NestJS application instance to access the DI container
    const app = await NestFactory.create(UsersServiceModule);
    const configService = app.get(ConfigService);

    // Connect this application as a microservice using the Redis transporter
    app.connectMicroservice({
        transport: Transport.REDIS,
        options: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
        },
    });

    // Use our custom Winston logger for all logs in this microservice
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // Start all registered microservices and begin listening for incoming messages
    await app.startAllMicroservices();

    // Optional: Also listen on an HTTP port for health checks or other purposes
    const httpPort = configService.get('USERS_SERVICE_PORT');
    if (httpPort) {
        await app.listen(httpPort);
        const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
        logger.log(`Users microservice is listening on port ${httpPort}...`);
    }
}
bootstrap();
