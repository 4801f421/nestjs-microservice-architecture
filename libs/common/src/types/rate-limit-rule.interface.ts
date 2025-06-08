// libs/common/src/types/rate-limit-rule.interface.ts
export type RateLimitAlgorithm = 'sliding' | 'fixed';
export type RateLimitTracker = 'ip' | 'user' | 'smart';

export interface RateLimitRule {
    ttl: number;
    limit: number | string;
    algorithm?: RateLimitAlgorithm;
    tracker?: RateLimitTracker;
}
