// scripts/test-errors.ts


import {
    ValidationError,
    DatabaseError,
    WebSocketError,
    TradingError,
    ConfigurationError,
    NotFoundError,
    RateLimitError,
} from '../src/errors';

import {
    handleError,
    isOperationalError,
    formatErrorResponse,
    safeAsync,
    retry,
    CircuitBreaker,
} from '../src/utils/error-handler';

import { logInfo } from '../src/utils/logger';

/**
 * Test all error handling
 */
async function testErrors(): Promise<void> {
    console.log('\n=== Error Handling Test ===\n');

    // Test 1: Custom Error Classes
    console.log('1. Testing custom error classes:\n');

    try {
        throw new ValidationError(
            'Invalid trade parameters',
            ['Stop loss must be below entry price', 'Target is too close'],
            { entryPrice: 22450, stopLoss: 22460 }
        );
    } catch (error) {
        console.log('   ValidationError caught:');
        console.log('   Message:', (error as ValidationError).message);
        console.log('   Errors:', (error as ValidationError).errors);
        console.log('   Operational:', isOperationalError(error as Error) ? '✅ Yes' : '❌ No');
    }

    console.log('');

    try {
        throw new DatabaseError(
            'Failed to insert document',
            'INSERT',
            'trades',
            { tradeId: 'trade-001' }
        );
    } catch (error) {
        console.log('   DatabaseError caught:');
        console.log('   Message:', (error as DatabaseError).message);
        console.log('   Operation:', (error as DatabaseError).operation);
        console.log('   Collection:', (error as DatabaseError).collection);
    }

    console.log('');

    try {
        throw new WebSocketError(
            'WebSocket connection lost',
            'ws-12345',
            'disconnect',
            { reason: 'timeout' }
        );
    } catch (error) {
        console.log('   WebSocketError caught:');
        console.log('   Message:', (error as WebSocketError).message);
        console.log('   Connection ID:', (error as WebSocketError).connectionId);
    }

    console.log('');

    // Test 2: Error Formatting
    console.log('2. Testing error formatting:\n');

    const tradingError = new TradingError(
        'Failed to execute trade',
        'trade-001',
        'NIFTY',
        'BUY'
    );

    const formatted = formatErrorResponse(tradingError);
    console.log('   Formatted error:', JSON.stringify(formatted, null, 2));

    console.log('');

    // Test 3: Safe Async
    console.log('3. Testing safe async execution:\n');

    async function riskyOperation(): Promise<string> {
        throw new Error('Something went wrong');
    }

    const [result, error] = await safeAsync(riskyOperation());
    console.log('   Result:', result);
    console.log('   Error:', error?.message);
    console.log('   No crash! ✅');

    console.log('');

    // Test 4: Retry Mechanism
    console.log('4. Testing retry mechanism:\n');

    let attemptCount = 0;

    async function unreliableOperation(): Promise<string> {
        attemptCount++;
        console.log(`   Attempt ${attemptCount}...`);

        if (attemptCount < 3) {
            throw new Error('Operation failed');
        }

        return 'Success!';
    }

    try {
        const retryResult = await retry(unreliableOperation, {
            attempts: 5,
            delay: 100,
            factor: 1,
            onRetry: (attempt, error) => {
                console.log(`   Retry attempt ${attempt} after error: ${error.message}`);
            },
        });
        console.log('   Final result:', retryResult);
    } catch (error) {
        console.log('   Retry failed:', (error as Error).message);
    }

    console.log('');

    // Test 5: Circuit Breaker
    console.log('5. Testing circuit breaker:\n');

    const circuitBreaker = new CircuitBreaker(3, 60000, 5000);

    let callCount = 0;

    async function unreliableService(): Promise<string> {
        callCount++;

        if (callCount <= 3) {
            throw new Error('Service unavailable');
        }

        return 'Service response';
    }

    for (let i = 1; i <= 5; i++) {
        try {
            console.log(`   Call ${i} - Circuit state: ${circuitBreaker.getState()}`);
            const cbResult = await circuitBreaker.execute(unreliableService);
            console.log(`   Result: ${cbResult}`);
        } catch (error) {
            console.log(`   Error: ${(error as Error).message}`);
        }
    }

    console.log('');

    // Test 6: Error Handler
    console.log('6. Testing error handler:\n');

    try {
        throw new NotFoundError(
            'Trade not found',
            'trade',
            'trade-xyz'
        );
    } catch (error) {
        handleError(error as Error, { test: true });
        console.log('   Error handled and logged ✅');
    }

    console.log('');

    console.log('✅ All error handling tests completed!\n');
    console.log('=== Test Complete ===\n');

    process.exit(0);
}

// Run test
testErrors();