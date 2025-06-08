import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const TRACE_ID_HEADER = 'X-Trace-Id';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
	// Generate a unique trace ID for each request.
	const traceId = uuidv4();
	// Attach it to the request object for other parts of the app to use.
	req[TRACE_ID_HEADER] = traceId;
	// Set it as a response header so the client can see it too.
	res.setHeader(TRACE_ID_HEADER, traceId);
	next();
  }
}