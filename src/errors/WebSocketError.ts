// src/errors/WebSocketError.ts

import { BaseError } from './BaseError';

/**
 * WebSocketError
 * Thrown when WebSocket operations fail
 */

export class WebSocketError extends BaseError {
    public readonly connectionId?: string;
    public readonly event?: string;

    constructor(
        message: string,
        connectionId?: string,
        event?: string,
        context?: Record<string, any>
    ) {
        super(message, 500, true, context);
        this.connectionId = connectionId;
        this.event = event;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            connectionId: this.connectionId,
            event: this.event,
        };
    }
}