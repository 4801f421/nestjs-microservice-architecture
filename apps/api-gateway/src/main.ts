// apps/api-gateway/src/main.ts
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import {
    AllExceptionsFilter,
    JwtAuthGuard,
    LoggingInterceptor,
} from '@app/common';
import { TraceIdMiddleware } from './common/middleware/trace-id.middleware';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
    const app = await NestFactory.create(ApiGatewayModule);
    const configService = app.get(ConfigService);

    // Use our custom Winston logger for all gateway logs.
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // Apply the Trace ID middleware to all incoming requests.
    app.use(new TraceIdMiddleware().use);

    // Apply our global, custom exception filter.
    app.useGlobalFilters(new AllExceptionsFilter());

    // Apply our global logging interceptor.
    app.useGlobalInterceptors(new LoggingInterceptor());

    // Apply global validation pipe to automatically validate all incoming DTOs.
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, transform: true }),
    );

    // Set a global prefix for all routes (e.g., /api/v1/...).
    app.setGlobalPrefix('api');

    // Enable CORS for frontend applications.
    app.enableCors();

    const port = configService.get<number>('API_GATEWAY_PORT') || 3000;
    await app.listen(port);

    const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    logger.log(`API Gateway is listening on port ${port}...`);
}
bootstrap();
