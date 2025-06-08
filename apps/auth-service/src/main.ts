// apps/auth-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    },
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.startAllMicroservices();

  const httpPort = configService.get('AUTH_SERVICE_PORT');
  if (httpPort) {
    await app.listen(httpPort);
    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    logger.log(`Auth microservice is listening on port ${httpPort}...`);
  }
}
bootstrap();