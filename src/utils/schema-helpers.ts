// src/utils/schema-helpers.ts

/**
 * Helper functions for working with schemas
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique IDs
 */
export function generateTradeId(): string {
    return `trade-${Date.now()}-${uuidv4().slice(0, 8)}`;
}

export function generateSignalId(): string {
    return `signal-${Date.now()}-${uuidv4().slice(0, 8)}`;
}

export function generateOrderId(): string {
    return `order-${Date.now()}-${uuidv4().slice(0, 8)}`;
}

export function generatePositionId(): string {
    return `position-${Date.now()}-${uuidv4().slice(0, 8)}`;
}

export function generatePortfolioId(): string {
    return `portfolio-${Date.now()}`;
}

/**
 * Calculate P&L
 */
export function calculatePnL(
    entryPrice: number,
    exitPrice: number,
    quantity: number,
    direction: 'LONG' | 'SHORT'
): number {
    if (direction === 'LONG') {
        return (exitPrice - entryPrice) * quantity;
    } else {
        return (entryPrice - exitPrice) * quantity;
    }
}

/**
 * Calculate P&L percentage
 */
export function calculatePnLPercent(
    entryPrice: number,
    exitPrice: number,
    direction: 'LONG' | 'SHORT'
): number {
    if (direction === 'LONG') {
        return ((exitPrice - entryPrice) / entryPrice) * 100;
    } else {
        return ((entryPrice - exitPrice) / entryPrice) * 100;
    }
}

/**
 * Calculate risk-reward ratio
 */
export function calculateRiskRewardRatio(
    entryPrice: number,
    stopLoss: number,
    target: number,
    direction: 'LONG' | 'SHORT'
): number {
    if (direction === 'LONG') {
        const risk = entryPrice - stopLoss;
        const reward = target - entryPrice;
        return reward / risk;
    } else {
        const risk = stopLoss - entryPrice;
        const reward = entryPrice - target;
        return reward / risk;
    }
}

/**
 * Validate trade parameters
 */
export function validateTradeParams(params: {
    entryPrice: number;
    stopLoss: number;
    target: number;
    direction: 'LONG' | 'SHORT';
}): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (params.entryPrice <= 0) {
        errors.push('Entry price must be positive');
    }

    if (params.stopLoss <= 0) {
        errors.push('Stop loss must be positive');
    }

    if (params.target <= 0) {
        errors.push('Target must be positive');
    }

    if (params.direction === 'LONG') {
        if (params.stopLoss >= params.entryPrice) {
            errors.push('Stop loss must be below entry price for LONG trades');
        }
        if (params.target <= params.entryPrice) {
            errors.push('Target must be above entry price for LONG trades');
        }
    } else {
        if (params.stopLoss <= params.entryPrice) {
            errors.push('Stop loss must be above entry price for SHORT trades');
        }
        if (params.target >= params.entryPrice) {
            errors.push('Target must be below entry price for SHORT trades');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}