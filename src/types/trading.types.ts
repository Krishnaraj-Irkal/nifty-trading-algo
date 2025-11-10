// src/types/trading.types.ts

/**
 * Trading-related type definitions
 */

export type TradeDirection = 'LONG' | 'SHORT';
export type TradeStatus = 'PENDING' | 'OPEN' | 'CLOSED' | 'CANCELLED';
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS';
export type OrderStatus = 'PENDING' | 'FILLED' | 'PARTIALLY_FILLED' | 'CANCELLED' | 'REJECTED';
export type ExitReason = 'TARGET' | 'STOP_LOSS' | 'TIME_BASED' | 'MANUAL' | 'RISK_LIMIT';

export interface ISignal {
    signalId: string;
    strategy: string;
    symbol: string;
    exchange: string;
    timeframe: string;
    timestamp: Date;
    type: 'BUY' | 'SELL';
    direction: TradeDirection;
    confidence: number;
    confirmations: Array<{
        indicator: string;
        status: boolean;
        value?: any;
    }>;
    price: number;
    stopLoss: number;
    target1: number;
    target2?: number;
    riskRewardRatio: number;
    executed: boolean;
    executedAt?: Date;
    tradeId?: string;
    reasoning?: string;
}

export interface IOrder {
    orderId: string;
    tradeId?: string;
    positionId?: string;
    symbol: string;
    exchange: string;
    orderType: OrderType;
    direction: TradeDirection;
    quantity: number;
    price?: number;
    triggerPrice?: number;
    status: OrderStatus;
    filledQuantity: number;
    filledPrice?: number;
    placedAt: Date;
    filledAt?: Date;
    cancelledAt?: Date;
    isPaperTrade: boolean;
}

export interface IPosition {
    positionId: string;
    tradeId: string;
    symbol: string;
    exchange: string;
    direction: TradeDirection;
    quantity: number;
    entryPrice: number;
    entryTime: Date;
    exitPrice?: number;
    exitTime?: Date;
    currentPrice: number;
    stopLoss: number;
    target1: number;
    target2?: number;
    unrealizedPnL: number;
    realizedPnL?: number;
    status: 'OPEN' | 'CLOSED';
    exitReason?: ExitReason;
    maxAdverseExcursion?: number;
    maxFavorableExcursion?: number;
    isPaperTrade: boolean;
}

export interface ITrade {
    tradeId: string;
    strategy: string;
    symbol: string;
    exchange: string;
    direction: TradeDirection;
    entry: {
        price: number;
        timestamp: Date;
        reason: string;
        signals: string[];
        confidence: number;
    };
    exit?: {
        price: number;
        timestamp: Date;
        reason: ExitReason;
        actualPnL: number;
        actualPnLPercent: number;
    };
    riskManagement: {
        stopLoss: number;
        target1: number;
        target2?: number;
        riskAmount: number;
        positionSize: number;
        riskRewardRatio: number;
    };
    performance?: {
        maxAdverseExcursion: number;
        maxFavorableExcursion: number;
        durationMinutes: number;
        slippage: number;
    };
    marketConditions?: {
        vix?: number;
        trend?: string;
        volatility?: string;
        timeOfDay?: string;
    };
    status: TradeStatus;
    isPaperTrade: boolean;
}

export interface IPortfolio {
    portfolioId: string;
    timestamp: Date;
    cashBalance: number;
    initialCapital: number;
    currentValue: number;
    totalPnL: number;
    totalPnLPercent: number;
    dailyPnL: number;
    weeklyPnL: number;
    openPositions: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    consecutiveWins: number;
    consecutiveLosses: number;
    maxDrawdown: number;
    currentDrawdown: number;
    peakValue: number;
    sharpeRatio?: number;
}