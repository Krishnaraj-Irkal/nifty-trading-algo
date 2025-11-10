// src/errors/BaseError.ts

/**
 * Base Error Class
 * All custom errors extend from this
 */

export class BaseError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly context?: Record<string, any>;
    public readonly timestamp: Date;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
        context?: Record<string, any>
    ) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.context = context;
        this.timestamp = new Date();

        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            context: this.context,
            timestamp: this.timestamp,
            stack: this.stack,
        };
    }
}