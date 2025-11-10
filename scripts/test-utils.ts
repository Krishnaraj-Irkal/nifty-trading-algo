// scripts/test-utils.ts

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import {
    isMarketOpen,
    isMarketOpenDay,
    getMarketSession,
    getNextMarketOpen,
    isOpeningRangePeriod,
    formatDateTime,
    getTimeOfDay,
} from '../src/utils/date.utils';

import {
    round,
    average,
    standardDeviation,
    calculatePercent,
    calculatePercentChange,
    sharpeRatio,
    formatCurrency,
} from '../src/utils/math.utils';

import {
    validatePrice,
    validateTradeSetup,
    validateRiskRewardRatio,
} from '../src/utils/validators';

import {
    generateTradeId,
    calculatePnL,
    calculateRiskRewardRatio,
} from '../src/utils/schema-helpers';

/**
 * Test all utility functions
 */
function testUtils(): void {
    console.log('\n=== Utility Functions Test ===\n');

    // Test Date Utils
    console.log('1. Date Utils:');
    console.log('   Current time:', formatDateTime(new Date()));
    console.log('   Market open today?', isMarketOpenDay() ? '✅ Yes' : '❌ No');
    console.log('   Market open now?', isMarketOpen() ? '✅ Yes' : '❌ No');
    console.log('   Market session:', getMarketSession());
    console.log('   Time of day:', getTimeOfDay());
    console.log('   Opening range period?', isOpeningRangePeriod() ? '✅ Yes' : '❌ No');
    console.log('   Next market open:', formatDateTime(getNextMarketOpen()));

    // Test Math Utils
    console.log('\n2. Math Utils:');
    const prices = [100, 105, 103, 108, 110, 107, 112];
    console.log('   Prices:', prices);
    console.log('   Average:', round(average(prices), 2));
    console.log('   Std Dev:', round(standardDeviation(prices), 2));
    console.log('   Percent change (100 → 112):', calculatePercentChange(100, 112) + '%');
    console.log('   Format currency:', formatCurrency(1234567.89));

    const returns = [2.5, -1.2, 3.1, 0.8, -0.5, 2.3];
    console.log('   Returns:', returns);
    console.log('   Sharpe Ratio:', round(sharpeRatio(returns), 2));

    // Test Validators
    console.log('\n3. Validators:');
    const priceCheck = validatePrice(22450);
    console.log('   Price 22450 valid?', priceCheck.valid ? '✅ Yes' : '❌ No');

    const tradeSetup = {
        symbol: 'NIFTY',
        entryPrice: 22450,
        stopLoss: 22420,
        target: 22510,
        quantity: 50,
        direction: 'LONG' as const,
        confidence: 85,
    };

    const setupCheck = validateTradeSetup(tradeSetup);
    console.log('   Trade setup valid?', setupCheck.valid ? '✅ Yes' : '❌ No');
    if (!setupCheck.valid) {
        console.log('   Errors:', setupCheck.errors);
    }

    const rrCheck = validateRiskRewardRatio(22450, 22420, 22510, 'LONG');
    console.log('   Risk-Reward ratio:', rrCheck.ratio?.toFixed(2));
    console.log('   RR valid?', rrCheck.valid ? '✅ Yes' : '❌ No');

    // Test Schema Helpers
    console.log('\n4. Schema Helpers:');
    console.log('   Generated Trade ID:', generateTradeId());

    const pnl = calculatePnL(22450, 22510, 50, 'LONG');
    console.log('   P&L calculation (22450 → 22510, 50 qty, LONG):', formatCurrency(pnl));

    const rr = calculateRiskRewardRatio(22450, 22420, 22510, 'LONG');
    console.log('   Risk-Reward ratio:', rr.toFixed(2));

    // Additional Math Tests
    console.log('\n5. Additional Math Tests:');
    const values = [10, 20, 30, 40, 50];
    console.log('   Values:', values);
    console.log('   Sum:', values.reduce((a, b) => a + b, 0));
    console.log('   Min:', Math.min(...values));
    console.log('   Max:', Math.max(...values));
    console.log('   Range:', Math.max(...values) - Math.min(...values));

    // Edge Cases
    console.log('\n6. Edge Cases:');

    const invalidPrice = validatePrice(-100);
    console.log('   Negative price valid?', invalidPrice.valid ? '✅ Yes' : '❌ No');
    console.log('   Error:', invalidPrice.error);

    const invalidStopLoss = validateRiskRewardRatio(22450, 22460, 22510, 'LONG');
    console.log('   Invalid stop loss (above entry)?', invalidStopLoss.valid ? '✅ Yes' : '❌ No');
    console.log('   Error:', invalidStopLoss.error);

    console.log('\n✅ All utility tests completed!\n');
    console.log('=== Test Complete ===\n');
}

// Run test
testUtils();