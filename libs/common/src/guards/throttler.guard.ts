// libs/common/src/guards/simple-throttler.guard.ts
import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class SimpleThrottlerGuard extends ThrottlerGuard {
    /**
     * Overridden to provide smart tracking.
     * It assumes that another guard (like JwtAuthGuard) has already run
     * and attached the user object to the request if a valid JWT was present.
     */
    protected async getTracker(req: any): Promise<string> {
        // If req.user exists, it means the user is authenticated.
        // We use their ID ('sub' from the JWT payload) as the tracker.
        if (req.user?.sub) {
            return req.user.sub;
        }

        // Otherwise, for guests, we fall back to the IP address.
        return req.ip;
    }
}
