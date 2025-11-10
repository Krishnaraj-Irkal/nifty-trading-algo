// src/utils/math.utils.ts

/**
 * Mathematical and Statistical Utilities
 */

/**
 * Round to specified decimal places
 */
export function round(value: number, decimals: number = 2): number {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
}

/**
 * Round to tick size (for prices)
 */
export function roundToTick(price: number, tickSize: number = 0.05): number {
    return Math.round(price / tickSize) * tickSize;
}

/**
 * Calculate percentage
 */
export function calculatePercent(value: number, total: number): number {
    if (total === 0) return 0;
    return round((value / total) * 100, 2);
}

/**
 * Calculate percentage change
 */
export function calculatePercentChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) return 0;
    return round(((newValue - oldValue) / oldValue) * 100, 2);
}

/**
 * Calculate sum of array
 */
export function sum(values: number[]): number {
    return values.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculate average (mean)
 */
export function average(values: number[]): number {
    if (values.length === 0) return 0;
    return sum(values) / values.length;
}

/**
 * Calculate median
 */
export function median(values: number[]): number {
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }

    return sorted[mid];
}

/**
 * Calculate standard deviation
 */
export function standardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const avg = average(values);
    const squaredDiffs = values.map(value => Math.pow(value - avg, 2));
    const variance = average(squaredDiffs);

    return Math.sqrt(variance);
}

/**
 * Calculate variance
 */
export function variance(values: number[]): number {
    if (values.length === 0) return 0;

    const avg = average(values);
    const squaredDiffs = values.map(value => Math.pow(value - avg, 2));

    return average(squaredDiffs);
}

/**
 * Find minimum value
 */
export function min(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.min(...values);
}

/**
 * Find maximum value
 */
export function max(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.max(...values);
}

/**
 * Calculate range (max - min)
 */
export function range(values: number[]): number {
    return max(values) - min(values);
}

/**
 * Calculate percentile
 */
export function percentile(values: number[], p: number): number {
    if (values.length === 0) return 0;
    if (p < 0 || p > 100) throw new Error('Percentile must be between 0 and 100');

    const sorted = [...values].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (lower === upper) {
        return sorted[lower];
    }

    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Check if value is within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Linear interpolation
 */
export function lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
}

/**
 * Calculate moving average
 */
export function movingAverage(values: number[], period: number): number[] {
    if (values.length < period) return [];

    const result: number[] = [];

    for (let i = period - 1; i < values.length; i++) {
        const slice = values.slice(i - period + 1, i + 1);
        result.push(average(slice));
    }

    return result;
}

/**
 * Calculate exponential moving average
 */
export function exponentialMovingAverage(
    values: number[],
    period: number
): number[] {
    if (values.length < period) return [];

    const k = 2 / (period + 1);
    const result: number[] = [];

    // First EMA is simple average
    let ema = average(values.slice(0, period));
    result.push(ema);

    // Calculate rest using EMA formula
    for (let i = period; i < values.length; i++) {
        ema = values[i] * k + ema * (1 - k);
        result.push(ema);
    }

    return result;
}

/**
 * Calculate true range (for ATR)
 */
export function trueRange(high: number, low: number, prevClose: number): number {
    return Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
    );
}

/**
 * Normalize value to 0-1 range
 */
export function normalize(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return (value - min) / (max - min);
}

/**
 * Calculate correlation coefficient between two arrays
 */
export function correlation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const avgX = average(x);
    const avgY = average(y);

    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < n; i++) {
        const diffX = x[i] - avgX;
        const diffY = y[i] - avgY;
        numerator += diffX * diffY;
        denomX += diffX * diffX;
        denomY += diffY * diffY;
    }

    const denominator = Math.sqrt(denomX * denomY);
    if (denominator === 0) return 0;

    return numerator / denominator;
}

/**
 * Calculate Sharpe ratio
 */
export function sharpeRatio(
    returns: number[],
    riskFreeRate: number = 0
): number {
    if (returns.length === 0) return 0;

    const avgReturn = average(returns);
    const stdDev = standardDeviation(returns);

    if (stdDev === 0) return 0;

    return (avgReturn - riskFreeRate) / stdDev;
}

/**
 * Format number with commas
 */
export function formatNumber(value: number, decimals: number = 2): string {
    return value.toLocaleString('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

/**
 * Format currency (INR)
 */
export function formatCurrency(value: number, decimals: number = 2): string {
    return `₹${formatNumber(value, decimals)}`;
}

/**
 * Generate random number between min and max
 */
export function randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Generate random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}