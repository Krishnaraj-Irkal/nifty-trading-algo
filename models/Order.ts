// models/Order.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IOrder } from '../src/types/trading.types';

interface IOrderDocument extends IOrder, mongoose.Document { }

const OrderSchema = new Schema<IOrderDocument>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        tradeId: {
            type: String,
            index: true,
        },
        positionId: {
            type: String,
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
        orderType: {
            type: String,
            required: true,
            enum: ['MARKET', 'LIMIT', 'STOP_LOSS'],
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
        price: Number,
        triggerPrice: Number,
        status: {
            type: String,
            required: true,
            enum: ['PENDING', 'FILLED', 'PARTIALLY_FILLED', 'CANCELLED', 'REJECTED'],
            default: 'PENDING',
            index: true,
        },
        filledQuantity: {
            type: Number,
            default: 0,
        },
        filledPrice: Number,
        placedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },
        filledAt: Date,
        cancelledAt: Date,
        isPaperTrade: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: 'orders',
    }
);

// Compound indexes
OrderSchema.index({ status: 1, placedAt: -1 });
OrderSchema.index({ tradeId: 1, status: 1 });

const Order: Model<IOrderDocument> = mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);

export default Order;
export type { IOrderDocument };