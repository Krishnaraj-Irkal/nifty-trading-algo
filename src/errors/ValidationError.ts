// src/errors/ValidationError.ts

import { BaseError } from './BaseError';

/**
 * ValidationError
 * Thrown when input validation fails
 */

export class ValidationError extends BaseError {
    public readonly errors: string[];

    constructor(
        message: string,
        errors: string[] = [],
        context?: Record<string, any>
    ) {
        super(message, 400, true, context);
        this.errors = errors;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            errors: this.errors,
        };
    }
}