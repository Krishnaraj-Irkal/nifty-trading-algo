// models/Portfolio.ts

import mongoose, { Schema, Model } from 'mongoose';
import { IPortfolio } from '../src/types/trading.types';

interface IPortfolioDocument extends IPortfolio, mongoose.Document { }

const PortfolioSchema = new Schema<IPortfolioDocument>(
    {
        portfolioId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        timestamp: {
            type: Date,
            required: true,
            default: Date.now,
            index: true,
        },
        cashBalance: {
            type: Number,
            required: true,
        },
        initialCapital: {
            type: Number,
            required: true,
        },
        currentValue: {
            type: Number,
            required: true,
        },
        totalPnL: {
            type: Number,
            default: 0,
        },
        totalPnLPercent: {
            type: Number,
            default: 0,
        },
        dailyPnL: {
            type: Number,
            default: 0,
        },
        weeklyPnL: {
            type: Number,
            default: 0,
        },
        openPositions: {
            type: Number,
            default: 0,
        },
        totalTrades: {
            type: Number,
            default: 0,
        },
        winningTrades: {
            type: Number,
            default: 0,
        },
        losingTrades: {
            type: Number,
            default: 0,
        },
        winRate: {
            type: Number,
            default: 0,
        },
        averageWin: {
            type: Number,
            default: 0,
        },
        averageLoss: {
            type: Number,
            default: 0,
        },
        largestWin: {
            type: Number,
            default: 0,
        },
        largestLoss: {
            type: Number,
            default: 0,
        },
        consecutiveWins: {
            type: Number,
            default: 0,
        },
        consecutiveLosses: {
            type: Number,
            default: 0,
        },
        maxDrawdown: {
            type: Number,
            default: 0,
        },
        currentDrawdown: {
            type: Number,
            default: 0,
        },
        peakValue: {
            type: Number,
            required: true,
        },
        sharpeRatio: Number,
    },
    {
        timestamps: true,
        collection: 'portfolio',
    }
);

// Index for latest portfolio snapshot
PortfolioSchema.index({ timestamp: -1 });

const Portfolio: Model<IPortfolioDocument> = mongoose.models.Portfolio || mongoose.model<IPortfolioDocument>('Portfolio', PortfolioSchema);

export default Portfolio;
export type { IPortfolioDocument };