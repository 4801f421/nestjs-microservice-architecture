import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { TRACE_ID_HEADER } from '../constants/trace.constants';

@Catch() // Catch all exceptions
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        if (host.getType() !== 'http') {
            return;
        }

        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const traceId = request[TRACE_ID_HEADER] || 'N/A';

        let status: number;
        let message: string;
        let details: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            message =
                typeof errorResponse === 'string'
                    ? errorResponse
                    : (errorResponse as any).message;
            details =
                typeof errorResponse === 'object'
                    ? (errorResponse as any)
                    : undefined;
        } else if (exception instanceof RpcException) {
            const rpcError = exception.getError();

            // --- FIX IS HERE ---
            // We now also check if 'status' is a number to satisfy TypeScript.
            if (
                typeof rpcError === 'object' &&
                rpcError !== null &&
                'status' in rpcError &&
                typeof (rpcError as any).status === 'number' // This is the crucial type check
            ) {
                status = (rpcError as any).status;
                message =
                    (rpcError as any).message ||
                    'An error occurred in a downstream service.';
                details = rpcError;
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message =
                    'An unexpected error occurred in a downstream service.';
                details = rpcError;
            }
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            details = (exception as any).message;
        }

        const errorResponsePayload = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            traceId: traceId,
            message: message,
            ...(details && { details }),
            stack:
                process.env.NODE_ENV !== 'production'
                    ? (exception as any).stack
                    : undefined,
        };

        this.logger.error(
            `[Exception] An error occurred: ${JSON.stringify(errorResponsePayload)}`,
            (exception as any).stack,
        );

        response.status(status).json(errorResponsePayload);
    }
}
