// models/Candle.ts

import mongoose, { Schema, Model } from 'mongoose';
import { ICandle } from '../src/types/market.types';

interface ICandleDocument extends ICandle, mongoose.Document { }

const CandleSchema = new Schema<ICandleDocument>(
    {
        symbol: {
            type: String,
            required: true,
            index: true,
        },
        exchange: {
            type: String,
            required: true,
            index: true,
        },
        timeframe: {
            type: String,
            required: true,
            enum: ['1min', '5min', '15min', '1hour', '1day'],
            index: true,
        },
        timestamp: {
            type: Date,
            required: true,
            index: true,
        },
        open: {
            type: Number,
            required: true,
        },
        high: {
            type: Number,
            required: true,
        },
        low: {
            type: Number,
            required: true,
        },
        close: {
            type: Number,
            required: true,
        },
        volume: {
            type: Number,
            required: true,
            default: 0,
        },
        indicators: {
            vwap: Number,
            ema9: Number,
            ema21: Number,
            ema50: Number,
            rsi: Number,
            supertrend: {
                value: Number,
                direction: {
                    type: String,
                    enum: ['up', 'down'],
                },
            },
            atr: Number,
            macd: {
                macd: Number,
                signal: Number,
                histogram: Number,
            },
        },
        patterns: [
            {
                type: String,
                confidence: Number,
                direction: {
                    type: String,
                    enum: ['bullish', 'bearish', 'neutral'],
                },
            },
        ],
    },
    {
        timestamps: true,
        collection: 'candles',
    }
);

// Compound indexes for fast queries
CandleSchema.index({ symbol: 1, timeframe: 1, timestamp: -1 });
CandleSchema.index({ symbol: 1, exchange: 1, timeframe: 1, timestamp: -1 });

// Unique constraint to prevent duplicate candles
CandleSchema.index(
    { symbol: 1, timeframe: 1, timestamp: 1 },
    { unique: true }
);

const Candle: Model<ICandleDocument> = mongoose.models.Candle || mongoose.model<ICandleDocument>('Candle', CandleSchema);

export default Candle;
export type { ICandleDocument };