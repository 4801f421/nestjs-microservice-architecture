// libs/common/src/decorators/apply-rate-limit.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RateLimitRule } from '../types/rate-limit-rule.interface';

export const RATE_LIMIT_KEY = 'rate_limit_rules';

/**
 * A flexible decorator to apply rate limiting.
 * @param profileOrRules - Either the name of a predefined profile (string)
 * or a custom array of rate limit rules.
 */
export const ApplyRateLimit = (profileOrRules: string | RateLimitRule[]) =>
    SetMetadata(RATE_LIMIT_KEY, profileOrRules);
