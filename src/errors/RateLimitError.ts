// src/errors/RateLimitError.ts

import { BaseError } from './BaseError';

/**
 * RateLimitError
 * Thrown when rate limits are exceeded
 */

export class RateLimitError extends BaseError {
    public readonly retryAfter?: number;
    public readonly limit?: number;

    constructor(
        message: string,
        retryAfter?: number,
        limit?: number,
        context?: Record<string, any>
    ) {
        super(message, 429, true, context);
        this.retryAfter = retryAfter;
        this.limit = limit;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            retryAfter: this.retryAfter,
            limit: this.limit,
        };
    }
}