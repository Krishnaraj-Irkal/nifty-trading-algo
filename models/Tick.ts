// models/Tick.ts

import mongoose, { Schema, Model } from 'mongoose';
import { ITick } from '../src/types/market.types';

interface ITickDocument extends ITick, mongoose.Document { }

const TickSchema = new Schema<ITickDocument>(
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
        timestamp: {
            type: Date,
            required: true,
            index: true,
        },
        lastTradedPrice: {
            type: Number,
            required: true,
        },
        lastTradedTime: {
            type: Date,
            required: true,
        },
        volume: Number,
        openInterest: Number,
        bid: Number,
        ask: Number,
        high: Number,
        low: Number,
    },
    {
        timestamps: true,
        collection: 'ticks',
    }
);

// Compound index for fast queries
TickSchema.index({ symbol: 1, timestamp: -1 });
TickSchema.index({ exchange: 1, timestamp: -1 });

// TTL index - auto-delete ticks after 7 days
TickSchema.index({ timestamp: 1 }, { expireAfterSeconds: 604800 });

const Tick: Model<ITickDocument> = mongoose.models.Tick || mongoose.model<ITickDocument>('Tick', TickSchema);

export default Tick;
export type { ITickDocument };