import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

import { TRACE_ID_HEADER } from '../constants/trace.constants';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Check if the context is HTTP
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const traceId = request[TRACE_ID_HEADER]; // Get traceId from the request object

    const logData = {
      traceId,
      ip,
      method,
      url,
      headers: request.headers,
      body: this.maskSensitiveData(request.body),
    };

    this.logger.log(`[Request] ==> ${JSON.stringify(logData)}`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap((resBody) => {
          const { statusCode } = response;
          const duration = Date.now() - now;

          const responseLog = {
            traceId,
            statusCode,
            duration: `${duration}ms`,
            body: this.maskSensitiveData(resBody),
          };

          this.logger.log(`[Response] <== ${JSON.stringify(responseLog)}`);
        }),
      );
  }

  private maskSensitiveData(body: any): any {
    if (!body) {
      return body;
    }
    const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'creditCard'];
    const newBody = JSON.parse(JSON.stringify(body)); // Deep copy

    for (const key of sensitiveKeys) {
      if (newBody[key]) {
        newBody[key] = '*** MASKED ***';
      }
    }
    return newBody;
  }
}