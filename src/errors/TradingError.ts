// src/errors/TradingError.ts

import { BaseError } from './BaseError';

/**
 * TradingError
 * Thrown when trading operations fail
 */

export class TradingError extends BaseError {
    public readonly tradeId?: string;
    public readonly symbol?: string;
    public readonly operation?: string;

    constructor(
        message: string,
        tradeId?: string,
        symbol?: string,
        operation?: string,
        context?: Record<string, any>
    ) {
        super(message, 500, true, context);
        this.tradeId = tradeId;
        this.symbol = symbol;
        this.operation = operation;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            tradeId: this.tradeId,
            symbol: this.symbol,
            operation: this.operation,
        };
    }
}