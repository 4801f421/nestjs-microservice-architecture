// libs/common/src/config/rate-limit/limits.config.ts
import { registerAs } from '@nestjs/config';

// We use registerAs to make this configuration injectable via its KEY.
export default registerAs('limits', () => ({
    // This key will be referenced in our ThrottlerModule setup
    API_DEFAULT_LIMITS: {
        free: 100, // free plan: 100 requests per minute
        premium: 1000, // premium plan: 1000 requests per minute
        unauthenticated: 60, // guest users: 60 requests per minute
    },
}));
