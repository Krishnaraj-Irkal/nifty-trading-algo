// models/Trade.ts

import mongoose, { Schema, Model } from 'mongoose';
import { ITrade } from '../src/types/trading.types';

interface ITradeDocument extends ITrade, mongoose.Document { }

const TradeSchema = new Schema<ITradeDocument>(
    {
        tradeId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        strategy: {
            type: String,
            required: true,
            index: true,
        },
        symbol: {
            type: String,
            required: true,
            index: true,
        },
        exchange: {
            type: String,
            required: true,
        },
        direction: {
            type: String,
            required: true,
            enum: ['LONG', 'SHORT'],
        },
        entry: {
            price: {
                type: Number,
                required: true,
            },
            timestamp: {
                type: Date,
                required: true,
            },
            reason: String,
            signals: [String],
            confidence: Number,
        },
        exit: {
            price: Number,
            timestamp: Date,
            reason: {
                type: String,
                enum: ['TARGET', 'STOP_LOSS', 'TIME_BASED', 'MANUAL', 'RISK_LIMIT'],
            },
            actualPnL: Number,
            actualPnLPercent: Number,
        },
        riskManagement: {
            stopLoss: {
                type: Number,
                required: true,
            },
            target1: {
                type: Number,
                required: true,
            },
            target2: Number,
            riskAmount: Number,
            positionSize: Number,
            riskRewardRatio: Number,
        },
        performance: {
            maxAdverseExcursion: Number,
            maxFavorableExcursion: Number,
            durationMinutes: Number,
            slippage: Number,
        },
        marketConditions: {
            vix: Number,
            trend: String,
            volatility: String,
            timeOfDay: String,
        },
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'OPEN', 'CLOSED', 'CANCELLED'],
            default: 'PENDING',
            index: true,
        },
        isPaperTrade: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'trades',
    }
);

// Compound indexes
TradeSchema.index({ strategy: 1, status: 1, createdAt: -1 });
TradeSchema.index({ symbol: 1, createdAt: -1 });
TradeSchema.index({ status: 1, createdAt: -1 });

const Trade: Model<ITradeDocument> = mongoose.models.Trade || mongoose.model<ITradeDocument>('Trade', TradeSchema);

export default Trade;
export type { ITradeDocument };