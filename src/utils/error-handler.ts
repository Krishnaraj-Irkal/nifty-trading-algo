// src/utils/error-handler.ts

import { BaseError } from '../errors';
import { logError } from './logger';

/**
 * Error Handler Utilities
 */

/**
 * Check if error is operational (safe to continue)
 */
export function isOperationalError(error: Error): boolean {
    if (error instanceof BaseError) {
        return error.isOperational;
    }
    return false;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: Error) {
    if (error instanceof BaseError) {
        return {
            success: false,
            error: {
                name: error.name,
                message: error.message,
                statusCode: error.statusCode,
                ...(process.env.NODE_ENV === 'development' && {
                    stack: error.stack,
                    context: error.context,
                }),
            },
        };
    }

    // Generic error
    return {
        success: false,
        error: {
            name: 'Error',
            message: error.message || 'An unexpected error occurred',
            statusCode: 500,
            ...(process.env.NODE_ENV === 'development' && {
                stack: error.stack,
            }),
        },
    };
}

/**
 * Handle error with logging
 */
export function handleError(error: Error, context?: Record<string, any>): void {
    // Log error
    logError('Error occurred', error, context);

    // If error is not operational, it's a programmer error
    if (!isOperationalError(error)) {
        console.error('Non-operational error detected:', error);
        // In production, you might want to:
        // - Send alert to monitoring service
        // - Restart the process
        // - Exit gracefully
    }
}

/**
 * Async error wrapper (try-catch wrapper)
 */
export function asyncHandler<T extends any[], R>(
    fn: (...args: T) => Promise<R>
) {
    return async (...args: T): Promise<R> => {
        try {
            return await fn(...args);
        } catch (error) {
            handleError(error as Error, { function: fn.name, args });
            throw error;
        }
    };
}

/**
 * Sync error wrapper
 */
export function syncHandler<T extends any[], R>(
    fn: (...args: T) => R
) {
    return (...args: T): R => {
        try {
            return fn(...args);
        } catch (error) {
            handleError(error as Error, { function: fn.name, args });
            throw error;
        }
    };
}

/**
 * Safe async execution with error handling
 */
export async function safeAsync<T>(
    promise: Promise<T>,
    context?: Record<string, any>
): Promise<[T | null, Error | null]> {
    try {
        const result = await promise;
        return [result, null];
    } catch (error) {
        handleError(error as Error, context);
        return [null, error as Error];
    }
}

/**
 * Retry mechanism for failed operations
 */
export async function retry<T>(
    fn: () => Promise<T>,
    options: {
        attempts?: number;
        delay?: number;
        factor?: number;
        onRetry?: (attempt: number, error: Error) => void;
    } = {}
): Promise<T> {
    const {
        attempts = 3,
        delay = 1000,
        factor = 2,
        onRetry,
    } = options;

    let lastError: Error;

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;

            if (attempt === attempts) {
                throw lastError;
            }

            if (onRetry) {
                onRetry(attempt, lastError);
            }

            const waitTime = delay * Math.pow(factor, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    throw lastError!;
}

/**
 * Circuit breaker pattern
 */
export class CircuitBreaker {
    private failures: number = 0;
    private lastFailureTime?: number;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

    constructor(
        private threshold: number = 5,
        private timeout: number = 60000, // 1 minute
        private resetTimeout: number = 30000 // 30 seconds
    ) { }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime! > this.resetTimeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    private onSuccess(): void {
        this.failures = 0;
        this.state = 'CLOSED';
    }

    private onFailure(): void {
        this.failures++;
        this.lastFailureTime = Date.now();

        if (this.failures >= this.threshold) {
            this.state = 'OPEN';
        }
    }

    getState(): string {
        return this.state;
    }
}