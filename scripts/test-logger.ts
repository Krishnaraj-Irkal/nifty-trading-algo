// scripts/test-logger.ts


import {
    logInfo,
    logWarn,
    logError,
    logDebug,
    logDatabase,
    logWebSocket,
    logSignal,
    logTrade,
    logPerformance,
    logAPI,
    createLogger,
} from '../src/utils/logger';

/**
 * Test all logging functions
 */
async function testLogger(): Promise<void> {
    console.log('\n=== Logger Test ===\n');

    // Test 1: Basic log levels
    console.log('1. Testing basic log levels:\n');
    logDebug('This is a debug message', { component: 'test' });
    await sleep(100);

    logInfo('This is an info message', { component: 'test' });
    await sleep(100);

    logWarn('This is a warning message', { component: 'test' });
    await sleep(100);

    logError('This is an error message', new Error('Test error'));
    await sleep(100);

    // Test 2: Specialized loggers
    console.log('\n2. Testing specialized loggers:\n');

    logDatabase('INSERT', {
        collection: 'trades',
        duration: 45,
    });
    await sleep(100);

    logWebSocket('CONNECTED', {
        connectionId: 'ws-12345',
        timestamp: new Date(),
    });
    await sleep(100);

    logSignal('BUY', {
        symbol: 'NIFTY',
        direction: 'LONG',
        confidence: 85,
        price: 22450,
    });
    await sleep(100);

    logTrade('ENTRY', {
        tradeId: 'trade-001',
        symbol: 'NIFTY',
        direction: 'LONG',
        price: 22450,
        quantity: 50,
    });
    await sleep(100);

    logPerformance('order_execution_time', 125, 'ms');
    await sleep(100);

    logAPI('GET', '/api/trades', 200, 234);
    await sleep(100);

    // Test 3: Child logger with context
    console.log('\n3. Testing child logger:\n');

    const strategyLogger = createLogger({
        strategy: 'OpeningRangeBreakout',
        session: 'morning',
    });

    strategyLogger.info('Strategy initialized');
    await sleep(100);

    strategyLogger.warn('Low volume detected');
    await sleep(100);

    strategyLogger.error('Strategy execution failed');
    await sleep(100);

    // Test 4: Complex metadata
    console.log('\n4. Testing complex metadata:\n');

    logInfo('Trade executed successfully', {
        trade: {
            id: 'trade-001',
            symbol: 'NIFTY',
            entry: 22450,
            exit: 22550,
            pnl: 5000,
            duration: '45m',
        },
        strategy: {
            name: 'ORB',
            confidence: 85,
            confirmations: ['vwap', 'supertrend', 'volume'],
        },
    });
    await sleep(100);

    // Test 5: Error with stack trace
    console.log('\n5. Testing error with stack trace:\n');

    try {
        throw new Error('Simulated connection error');
    } catch (error) {
        logError('WebSocket connection failed', error, {
            retryAttempt: 3,
            maxRetries: 5,
        });
    }
    await sleep(100);

    console.log('\n=== Test Complete ===\n');
    console.log('✅ Check the logs/ directory for generated log files:');
    console.log('   - logs/app-YYYY-MM-DD.log (all logs)');
    console.log('   - logs/error-YYYY-MM-DD.log (errors only)\n');

    process.exit(0);
}

// Helper function to add delay
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run test
testLogger();