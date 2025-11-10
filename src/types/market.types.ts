// src/types/market.types.ts

/**
 * Market data type definitions
 */

export interface ITick {
    symbol: string;
    exchange: string;
    timestamp: Date;
    lastTradedPrice: number;
    lastTradedTime: Date;
    volume?: number;
    openInterest?: number;
    bid?: number;
    ask?: number;
    high?: number;
    low?: number;
}

export interface ICandle {
    symbol: string;
    exchange: string;
    timeframe: '1min' | '5min' | '15min' | '1hour' | '1day';
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    indicators?: {
        vwap?: number;
        ema9?: number;
        ema21?: number;
        ema50?: number;
        rsi?: number;
        supertrend?: {
            value: number;
            direction: 'up' | 'down';
        };
        atr?: number;
        macd?: {
            macd: number;
            signal: number;
            histogram: number;
        };
    };
    patterns?: Array<{
        type: string;
        confidence: number;
        direction: 'bullish' | 'bearish' | 'neutral';
    }>;
}

export type CandleTimeframe = '1min' | '5min' | '15min' | '1hour' | '1day';