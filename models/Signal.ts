// models/Signal.ts

import mongoose, { Schema, Model } from 'mongoose';
import { ISignal } from '../src/types/trading.types';

interface ISignalDocument extends ISignal, mongoose.Document { }

const SignalSchema = new Schema<ISignalDocument>(
    {
        signalId: {
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
        timeframe: {
            type: String,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
            index: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['BUY', 'SELL'],
        },
        direction: {
            type: String,
            required: true,
            enum: ['LONG', 'SHORT'],
        },
        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        confirmations: [
            {
                indicator: String,
                status: Boolean,
                value: Schema.Types.Mixed,
            },
        ],
        price: {
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
        riskRewardRatio: {
            type: Number,
            required: true,
        },
        executed: {
            type: Boolean,
            default: false,
            index: true,
        },
        executedAt: Date,
        tradeId: {
            type: String,
            index: true,
        },
        reasoning: String,
    },
    {
        timestamps: true,
        collection: 'signals',
    }
);

// Compound indexes
SignalSchema.index({ symbol: 1, timestamp: -1 });
SignalSchema.index({ strategy: 1, executed: 1 });

const Signal: Model<ISignalDocument> = mongoose.models.Signal || mongoose.model<ISignalDocument>('Signal', SignalSchema);

export default Signal;
export type { ISignalDocument };