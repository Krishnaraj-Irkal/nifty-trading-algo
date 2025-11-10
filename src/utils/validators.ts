// src/utils/validators.ts

/**
 * Validation Utilities
 */

import { TradeDirection } from '../types/trading.types';

/**
 * Validate price (must be positive)
 */
export function validatePrice(price: number): { valid: boolean; error?: string } {
    if (typeof price !== 'number' || isNaN(price)) {
        return { valid: false, error: 'Price must be a number' };
    }

    if (price <= 0) {
        return { valid: false, error: 'Price must be positive' };
    }

    return { valid: true };
}

/**
 * Validate quantity (must be positive integer)
 */
export function validateQuantity(quantity: number): { valid: boolean; error?: string } {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
        return { valid: false, error: 'Quantity must be a number' };
    }

    if (quantity <= 0) {
        return { valid: false, error: 'Quantity must be positive' };
    }

    if (!Number.isInteger(quantity)) {
        return { valid: false, error: 'Quantity must be an integer' };
    }

    return { valid: true };
}

/**
 * Validate stop loss vs entry price
 */
export function validateStopLoss(
    entryPrice: number,
    stopLoss: number,
    direction: TradeDirection
): { valid: boolean; error?: string } {
    const priceCheck = validatePrice(stopLoss);
    if (!priceCheck.valid) return priceCheck;

    if (direction === 'LONG' && stopLoss >= entryPrice) {
        return {
            valid: false,
            error: 'Stop loss must be below entry price for LONG positions',
        };
    }

    if (direction === 'SHORT' && stopLoss <= entryPrice) {
        return {
            valid: false,
            error: 'Stop loss must be above entry price for SHORT positions',
        };
    }

    // Check if stop loss is too far (> 5%)
    const diffPercent = Math.abs((stopLoss - entryPrice) / entryPrice) * 100;
    if (diffPercent > 5) {
        return {
            valid: false,
            error: 'Stop loss is too wide (> 5%)',
        };
    }

    return { valid: true };
}

/**
 * Validate target vs entry price
 */
export function validateTarget(
    entryPrice: number,
    target: number,
    direction: TradeDirection
): { valid: boolean; error?: string } {
    const priceCheck = validatePrice(target);
    if (!priceCheck.valid) return priceCheck;

    if (direction === 'LONG' && target <= entryPrice) {
        return {
            valid: false,
            error: 'Target must be above entry price for LONG positions',
        };
    }

    if (direction === 'SHORT' && target >= entryPrice) {
        return {
            valid: false,
            error: 'Target must be below entry price for SHORT positions',
        };
    }

    return { valid: true };
}

/**
 * Validate risk-reward ratio
 */
export function validateRiskRewardRatio(
    entryPrice: number,
    stopLoss: number,
    target: number,
    direction: TradeDirection,
    minRR: number = 1.5
): { valid: boolean; error?: string; ratio?: number } {
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(target - entryPrice);

    if (risk === 0) {
        return { valid: false, error: 'Risk cannot be zero' };
    }

    const ratio = reward / risk;

    if (ratio < minRR) {
        return {
            valid: false,
            error: `Risk-reward ratio (${ratio.toFixed(2)}) is below minimum (${minRR})`,
            ratio,
        };
    }

    return { valid: true, ratio };
}

/**
 * Validate symbol format
 */
export function validateSymbol(symbol: string): { valid: boolean; error?: string } {
    if (!symbol || typeof symbol !== 'string') {
        return { valid: false, error: 'Symbol must be a non-empty string' };
    }

    if (symbol.length < 2 || symbol.length > 20) {
        return { valid: false, error: 'Symbol length must be between 2 and 20 characters' };
    }

    if (!/^[A-Z0-9]+$/.test(symbol)) {
        return { valid: false, error: 'Symbol must contain only uppercase letters and numbers' };
    }

    return { valid: true };
}

/**
 * Validate confidence score (0-100)
 */
export function validateConfidence(confidence: number): { valid: boolean; error?: string } {
    if (typeof confidence !== 'number' || isNaN(confidence)) {
        return { valid: false, error: 'Confidence must be a number' };
    }

    if (confidence < 0 || confidence > 100) {
        return { valid: false, error: 'Confidence must be between 0 and 100' };
    }

    return { valid: true };
}

/**
 * Validate complete trade setup
 */
export function validateTradeSetup(setup: {
    symbol: string;
    entryPrice: number;
    stopLoss: number;
    target: number;
    quantity: number;
    direction: TradeDirection;
    confidence: number;
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    const symbolCheck = validateSymbol(setup.symbol);
    if (!symbolCheck.valid) errors.push(symbolCheck.error!);

    const priceCheck = validatePrice(setup.entryPrice);
    if (!priceCheck.valid) errors.push(priceCheck.error!);

    const quantityCheck = validateQuantity(setup.quantity);
    if (!quantityCheck.valid) errors.push(quantityCheck.error!);

    const stopCheck = validateStopLoss(setup.entryPrice, setup.stopLoss, setup.direction);
    if (!stopCheck.valid) errors.push(stopCheck.error!);

    const targetCheck = validateTarget(setup.entryPrice, setup.target, setup.direction);
    if (!targetCheck.valid) errors.push(targetCheck.error!);

    const rrCheck = validateRiskRewardRatio(
        setup.entryPrice,
        setup.stopLoss,
        setup.target,
        setup.direction
    );
    if (!rrCheck.valid) errors.push(rrCheck.error!);

    const confidenceCheck = validateConfidence(setup.confidence);
    if (!confidenceCheck.valid) errors.push(confidenceCheck.error!);

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
    return input.trim().replace(/[^\w\s-]/gi, '');
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }

    return { valid: true };
}

/**
 * Check if value is within percentage range
 */
export function isWithinPercentRange(
    value: number,
    target: number,
    percentRange: number
): boolean {
    const diff = Math.abs(value - target);
    const maxDiff = target * (percentRange / 100);
    return diff <= maxDiff;
}