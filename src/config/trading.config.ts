// src/config/trading.config.ts

/**
 * Trading Strategy Configuration
 * All trading parameters and risk management settings
 */

// Type definitions
interface CapitalConfig {
    initial: number;
    currency: string;
}

interface PositionSizeAdjustment {
    highVolatility: number;
    drawdown: number;
    winStreak: number;
}

interface RiskConfig {
    maxRiskPerTradePercent: number;
    dailyLossLimitPercent: number;
    weeklyLossLimitPercent: number;
    maxDrawdownPercent: number;
    maxConsecutiveLosses: number;
    maxOpenPositions: number;
    maxTradesPerDay: number;
    positionSizeAdjustment: PositionSizeAdjustment;
}

interface OpeningRangeConfig {
    startTime: string;
    endTime: string;
    durationMinutes: number;
    minRangeSizePercent: number;
    maxRangeSizePercent: number;
    minVolumeRatio: number;
}

interface BreakoutConfig {
    minVolumeMultiplier: number;
    closeInTopPercent: number;
    minBreakoutDistance: number;
}

interface EMAConfig {
    fast: number;
    medium: number;
    slow: number;
}

interface RSIConfig {
    period: number;
    overbought: number;
    oversold: number;
    bullishThreshold: number;
    bearishThreshold: number;
}

interface SupertrendConfig {
    period: number;
    multiplier: number;
}

interface TrendConfig {
    ema: EMAConfig;
    rsi: RSIConfig;
    supertrend: SupertrendConfig;
}

interface RetestConfig {
    maxWaitCandles: number;
    minWaitCandles: number;
    priceTolerancePercent: number;
    volumeRatio: number;
    maxRetestAttempts: number;
}

interface SignalWeights {
    trend: number;
    vwap: number;
    supertrend: number;
    volume: number;
    rsi: number;
    supportResistance: number;
    pattern: number;
}

interface SignalScoringConfig {
    minConfidence: number;
    weights: SignalWeights;
}

interface EntryConfig {
    stopLossBufferPercent: number;
    slippagePercent: number;
}

interface ExitConfig {
    rrRatioStrong: number;
    rrRatioModerate: number;
    partialExit1: number;
    partialExit2: number;
    moveToBreakevenAt: number;
    maxHoldMinutes: number;
    exitByTime: string;
}

interface StrategyConfig {
    openingRange: OpeningRangeConfig;
    breakout: BreakoutConfig;
    trend: TrendConfig;
    retest: RetestConfig;
    signalScoring: SignalScoringConfig;
    entry: EntryConfig;
    exit: ExitConfig;
}

interface TradingWindow {
    start: string;
    end: string;
}

interface AvoidTime {
    start: string;
    end: string;
    reason: string;
}

interface MarketHoursConfig {
    preMarketStart: string;
    marketOpen: string;
    lunchStart: string;
    lunchEnd: string;
    marketClose: string;
    postMarketEnd: string;
    tradingWindows: TradingWindow[];
    avoidTimes: AvoidTime[];
}

interface OptionsConfig {
    lotSize: number;
    strikeSelection: string;
    expiryPreference: string;
    bidAskSpreadMax: number;
    minOpenInterest: number;
}

interface SupportResistanceConfig {
    lookbackPeriods: number;
    touchThreshold: number;
    minTouches: number;
    proximityThreshold: number;
}

interface PatternsConfig {
    minConfidence: number;
    useInSignal: boolean;
}

interface ValidationResult {
    valid: boolean;
    errors: string[];
}

interface TradingConfig {
    capital: CapitalConfig;
    risk: RiskConfig;
    strategy: StrategyConfig;
    marketHours: MarketHoursConfig;
    options: OptionsConfig;
    supportResistance: SupportResistanceConfig;
    patterns: PatternsConfig;
    validate: () => ValidationResult;
}

// Configuration object
const tradingConfig: TradingConfig = {
    // Capital Management
    capital: {
        initial: parseFloat(process.env.PAPER_TRADING_CAPITAL || '10000'),
        currency: 'INR',
    },

    // Risk Management
    risk: {
        maxRiskPerTradePercent: parseFloat(process.env.RISK_PER_TRADE_PERCENT || '2'),
        dailyLossLimitPercent: parseFloat(process.env.DAILY_LOSS_LIMIT_PERCENT || '5'),
        weeklyLossLimitPercent: 10,
        maxDrawdownPercent: 20,
        maxConsecutiveLosses: 2,
        maxOpenPositions: parseInt(process.env.MAX_POSITIONS || '3'),
        maxTradesPerDay: parseInt(process.env.MAX_TRADES_PER_DAY || '5'),
        positionSizeAdjustment: {
            highVolatility: 0.5,
            drawdown: 0.5,
            winStreak: 1.25,
        },
    },

    // Strategy Parameters
    strategy: {
        openingRange: {
            startTime: '09:15',
            endTime: '09:30',
            durationMinutes: 15,
            minRangeSizePercent: 0.3,
            maxRangeSizePercent: 1.0,
            minVolumeRatio: 0.7,
        },

        breakout: {
            minVolumeMultiplier: 1.5,
            closeInTopPercent: 0.3,
            minBreakoutDistance: 0.15,
        },

        trend: {
            ema: {
                fast: 9,
                medium: 21,
                slow: 50,
            },
            rsi: {
                period: 14,
                overbought: 70,
                oversold: 30,
                bullishThreshold: 55,
                bearishThreshold: 45,
            },
            supertrend: {
                period: 10,
                multiplier: 3,
            },
        },

        retest: {
            maxWaitCandles: 15,
            minWaitCandles: 3,
            priceTolerancePercent: 0.2,
            volumeRatio: 0.7,
            maxRetestAttempts: 2,
        },

        signalScoring: {
            minConfidence: 70,
            weights: {
                trend: 25,
                vwap: 20,
                supertrend: 15,
                volume: 15,
                rsi: 10,
                supportResistance: 10,
                pattern: 5,
            },
        },

        entry: {
            stopLossBufferPercent: 0.1,
            slippagePercent: 0.02,
        },

        exit: {
            rrRatioStrong: 3,
            rrRatioModerate: 2,
            partialExit1: 0.5,
            partialExit2: 0.5,
            moveToBreakevenAt: 1.5,
            maxHoldMinutes: 120,
            exitByTime: '15:15',
        },
    },

    // Market timing
    marketHours: {
        preMarketStart: '09:00',
        marketOpen: '09:15',
        lunchStart: '11:30',
        lunchEnd: '13:00',
        marketClose: '15:30',
        postMarketEnd: '16:00',
        tradingWindows: [
            { start: '09:30', end: '11:30' },
            { start: '13:00', end: '14:30' },
        ],
        avoidTimes: [
            { start: '11:30', end: '13:00', reason: 'Lunch hour - low volume' },
            { start: '14:30', end: '15:30', reason: 'Too close to closing' },
        ],
    },

    // Options configuration
    options: {
        lotSize: 50,
        strikeSelection: 'ATM',
        expiryPreference: 'WEEKLY',
        bidAskSpreadMax: 0.02,
        minOpenInterest: 100,
    },

    // Support/Resistance
    supportResistance: {
        lookbackPeriods: 100,
        touchThreshold: 0.002,
        minTouches: 3,
        proximityThreshold: 0.003,
    },

    // Pattern recognition
    patterns: {
        minConfidence: 60,
        useInSignal: true,
    },

    // Validation method
    validate(): ValidationResult {
        const errors: string[] = [];

        if (this.capital.initial <= 0) {
            errors.push('Initial capital must be positive');
        }

        if (this.risk.maxRiskPerTradePercent < 0.5 || this.risk.maxRiskPerTradePercent > 5) {
            errors.push('Risk per trade should be between 0.5% and 5%');
        }

        if (this.strategy.signalScoring.minConfidence < 50 || this.strategy.signalScoring.minConfidence > 90) {
            errors.push('Min confidence should be between 50 and 90');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    },
};

export default tradingConfig;

// Export types
export type {
    TradingConfig,
    CapitalConfig,
    RiskConfig,
    StrategyConfig,
    MarketHoursConfig,
    OptionsConfig,
    SupportResistanceConfig,
    PatternsConfig,
    ValidationResult,
    OpeningRangeConfig,
    BreakoutConfig,
    TrendConfig,
    RetestConfig,
    SignalScoringConfig,
    EntryConfig,
    ExitConfig,
};