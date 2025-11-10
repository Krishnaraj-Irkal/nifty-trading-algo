// src/errors/ConfigurationError.ts

import { BaseError } from './BaseError';

/**
 * ConfigurationError
 * Thrown when configuration is invalid or missing
 */

export class ConfigurationError extends BaseError {
    public readonly configKey?: string;

    constructor(
        message: string,
        configKey?: string,
        context?: Record<string, any>
    ) {
        super(message, 500, false, context); // Not operational - requires fix
        this.configKey = configKey;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            configKey: this.configKey,
        };
    }
}