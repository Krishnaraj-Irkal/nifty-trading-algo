// src/types/logger.types.ts

/**
 * Logger type definitions
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LogMetadata {
    [key: string]: any;
}

export interface DatabaseLogDetails {
    operation: string;
    collection?: string;
    query?: any;
    duration?: number;
}

export interface WebSocketLogDetails {
    event: string;
    connectionId?: string;
    data?: any;
}

export interface SignalLogDetails {
    signal: string;
    symbol?: string;
    direction?: 'LONG' | 'SHORT';
    confidence?: number;
    price?: number;
}

export interface TradeLogDetails {
    action: string;
    tradeId?: string;
    symbol?: string;
    direction?: 'LONG' | 'SHORT';
    price?: number;
    quantity?: number;
    pnl?: number;
}

export interface PerformanceLogDetails {
    metric: string;
    value: number;
    unit?: string;
    timestamp?: Date;
}

export interface APILogDetails {
    method: string;
    endpoint: string;
    status?: number;
    duration?: number;
    error?: any;
}