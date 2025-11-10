// src/errors/DatabaseError.ts

import { BaseError } from './BaseError';

/**
 * DatabaseError
 * Thrown when database operations fail
 */

export class DatabaseError extends BaseError {
    public readonly operation: string;
    public readonly collection?: string;

    constructor(
        message: string,
        operation: string,
        collection?: string,
        context?: Record<string, any>
    ) {
        super(message, 500, true, context);
        this.operation = operation;
        this.collection = collection;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            operation: this.operation,
            collection: this.collection,
        };
    }
}