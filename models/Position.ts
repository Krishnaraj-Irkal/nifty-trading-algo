// models/Position.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IPosition } from '../src/types/trading.types';

interface IPositionDocument extends IPosition, mongoose.Document { }

const PositionSchema = new Schema<IPositionDocument>(
    {
        positionId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        tradeId: {
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
        quantity: {
            type: Number,
            required: true,
        },
        entryPrice: {
            type: Number,
            required: true,
        },
        entryTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        exitPrice: Number,
        exitTime: Date,
        currentPrice: {
            type: Number,
            required: true,
        },
        stopLoss: {
            type: Number,
            required: true,
        },
        target1: {
            type: Number,
            required: true,
        },
        target2: Number,
        unrealizedPnL: {
            type: Number,
            default: 0,
        },
        realizedPnL: Number,
        status: {
            type: String,
            required: true,
            enum: ['OPEN', 'CLOSED'],
            default: 'OPEN',
            index: true,
        },
        exitReason: {
            type: String,
            enum: ['TARGET', 'STOP_LOSS', 'TIME_BASED', 'MANUAL', 'RISK_LIMIT'],
        },
        maxAdverseExcursion: Number,
        maxFavorableExcursion: Number,
        isPaperTrade: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'positions',
    }
);

// Compound indexes
PositionSchema.index({ status: 1, entryTime: -1 });
PositionSchema.index({ tradeId: 1 });
PositionSchema.index({ symbol: 1, status: 1 });

// Calculate unrealized P&L before saving
PositionSchema.pre('save', function (next) {
    if (this.status === 'OPEN') {
        if (this.direction === 'LONG') {
            this.unrealizedPnL = (this.currentPrice - this.entryPrice) * this.quantity;
        } else {
            this.unrealizedPnL = (this.entryPrice - this.currentPrice) * this.quantity;
        }
    }
    next();
});

const Position: Model<IPositionDocument> = mongoose.models.Position || mongoose.model<IPositionDocument>('Position', PositionSchema);

export default Position;
export type { IPositionDocument };