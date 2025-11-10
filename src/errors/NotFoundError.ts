// src/errors/NotFoundError.ts

import { BaseError } from './BaseError';

/**
 * NotFoundError
 * Thrown when a resource is not found
 */

export class NotFoundError extends BaseError {
    public readonly resource?: string;
    public readonly resourceId?: string;

    constructor(
        message: string,
        resource?: string,
        resourceId?: string,
        context?: Record<string, any>
    ) {
        super(message, 404, true, context);
        this.resource = resource;
        this.resourceId = resourceId;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            resource: this.resource,
            resourceId: this.resourceId,
        };
    }
}