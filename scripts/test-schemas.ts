// scripts/test-schemas.ts


import { initializeDatabase, disconnectDatabase } from '../src/core/database/connection';
import { logInfo, logError } from '../src/utils/logger';
import {
    Tick,
    Candle,
    Signal,
    Order,
    Position,
    Trade,
    Portfolio,
} from '../models';

/**
 * Test all schemas
 */
async function testSchemas(): Promise<void> {
    console.log('\n=== Schema Test ===\n');

    try {
        // Connect to database
        logInfo('Connecting to database...');
        await initializeDatabase();

        // Test 1: Create a tick
        logInfo('Test 1: Creating a tick...');
        const tick = new Tick({
            symbol: 'NIFTY',
            exchange: 'NSE_EQ',
            timestamp: new Date(),
            lastTradedPrice: 22450.50,
            lastTradedTime: new Date(),
            volume: 1000,
            bid: 22449.50,
            ask: 22450.50,
        });
        await tick.save();
        logInfo('✅ Tick created successfully', { tickId: tick._id });

        // Test 2: Create a candle
        logInfo('Test 2: Creating a candle...');
        const candle = new Candle({
            symbol: 'NIFTY',
            exchange: 'NSE_EQ',
            timeframe: '1min',
            timestamp: new Date(),
            open: 22440,
            high: 22460,
            low: 22435,
            close: 22450,
            volume: 50000,
        });
        await candle.save();
        logInfo('✅ Candle created successfully', { candleId: candle._id });

        // Test 3: Create a signal
        logInfo('Test 3: Creating a signal...');
        const signal = new Signal({
            signalId: 'signal-test-001',
            strategy: 'OpeningRangeBreakout',
            symbol: 'NIFTY',
            exchange: 'NSE_EQ',
            timeframe: '1min',
            timestamp: new Date(),
            type: 'BUY',
            direction: 'LONG',
            confidence: 85,
            confirmations: [
                { indicator: 'vwap', status: true, value: 22440 },
                { indicator: 'supertrend', status: true },
            ],
            price: 22450,
            stopLoss: 22420,
            target1: 22510,
            target2: 22540,
            riskRewardRatio: 2,
        });
        await signal.save();
        logInfo('✅ Signal created successfully', { signalId: signal._id });

        // Test 4: Create an order
        logInfo('Test 4: Creating an order...');
        const order = new Order({
            orderId: 'order-test-001',
            symbol: 'NIFTY',
            exchange: 'NSE_EQ',
            orderType: 'MARKET',
            direction: 'LONG',
            quantity: 50,
            price: 22450,
            status: 'PENDING',
            filledQuantity: 0,
            placedAt: new Date(),
            isPaperTrade: true,
        });
        await order.save();
        logInfo('✅ Order created successfully', { orderId: order._id });

        // Test 5: Create a position
        logInfo('Test 5: Creating a position...');
        const position = new Position({
            positionId: 'position-test-001',
            tradeId: 'trade-test-001',
            symbol: 'NIFTY',
            exchange: 'NSE_EQ',
            direction: 'LONG',
            quantity: 50,
            entryPrice: 22450,
            entryTime: new Date(),
            currentPrice: 22460,
            stopLoss: 22420,
            target1: 22510,
            status: 'OPEN',
            isPaperTrade: true,
        });
        await position.save();
        logInfo('✅ Position created successfully', {
            positionId: position._id,
            unrealizedPnL: position.unrealizedPnL
        });

        // Test 6: Create a trade
        logInfo('Test 6: Creating a trade...');
        const trade = new Trade({
            tradeId: 'trade-test-001',
            strategy: 'OpeningRangeBreakout',
            symbol: 'NIFTY',
            exchange: 'NSE_EQ',
            direction: 'LONG',
            entry: {
                price: 22450,
                timestamp: new Date(),
                reason: 'Opening range breakout with confirmations',
                signals: ['vwap_above', 'supertrend_bullish', 'volume_spike'],
                confidence: 85,
            },
            riskManagement: {
                stopLoss: 22420,
                target1: 22510,
                target2: 22540,
                riskAmount: 1500,
                positionSize: 50,
                riskRewardRatio: 2,
            },
            status: 'OPEN',
            isPaperTrade: true,
        });
        await trade.save();
        logInfo('✅ Trade created successfully', { tradeId: trade._id });

        // Test 7: Create a portfolio snapshot
        logInfo('Test 7: Creating a portfolio snapshot...');
        const portfolio = new Portfolio({
            portfolioId: 'portfolio-test-001',
            timestamp: new Date(),
            cashBalance: 9500,
            initialCapital: 10000,
            currentValue: 10500,
            totalPnL: 500,
            totalPnLPercent: 5,
            dailyPnL: 500,
            weeklyPnL: 500,
            openPositions: 1,
            totalTrades: 1,
            winningTrades: 0,
            losingTrades: 0,
            winRate: 0,
            averageWin: 0,
            averageLoss: 0,
            largestWin: 0,
            largestLoss: 0,
            consecutiveWins: 0,
            consecutiveLosses: 0,
            maxDrawdown: 0,
            currentDrawdown: 0,
            peakValue: 10500,
        });
        await portfolio.save();
        logInfo('✅ Portfolio created successfully', { portfolioId: portfolio._id });

        // Test 8: Query data
        logInfo('\nTest 8: Querying data...');

        const tickCount = await Tick.countDocuments();
        logInfo(`   Ticks in database: ${tickCount}`);

        const candleCount = await Candle.countDocuments();
        logInfo(`   Candles in database: ${candleCount}`);

        const signalCount = await Signal.countDocuments();
        logInfo(`   Signals in database: ${signalCount}`);

        const orderCount = await Order.countDocuments();
        logInfo(`   Orders in database: ${orderCount}`);

        const positionCount = await Position.countDocuments();
        logInfo(`   Positions in database: ${positionCount}`);

        const tradeCount = await Trade.countDocuments();
        logInfo(`   Trades in database: ${tradeCount}`);

        const portfolioCount = await Portfolio.countDocuments();
        logInfo(`   Portfolio snapshots in database: ${portfolioCount}`);

        // Test 9: Update a document
        logInfo('\nTest 9: Updating position...');
        position.currentPrice = 22470;
        await position.save();
        logInfo('✅ Position updated', {
            newPrice: position.currentPrice,
            newPnL: position.unrealizedPnL
        });

        // Test 10: Complex query
        logInfo('\nTest 10: Complex query - Find open positions...');
        const openPositions = await Position.find({ status: 'OPEN' });
        logInfo(`   Found ${openPositions.length} open position(s)`);

        // Test 11: Cleanup (optional - comment out to keep data)
        logInfo('\nTest 11: Cleaning up test data...');
        await Tick.deleteOne({ _id: tick._id });
        await Candle.deleteOne({ _id: candle._id });
        await Signal.deleteOne({ _id: signal._id });
        await Order.deleteOne({ _id: order._id });
        await Position.deleteOne({ _id: position._id });
        await Trade.deleteOne({ _id: trade._id });
        await Portfolio.deleteOne({ _id: portfolio._id });
        logInfo('✅ Test data cleaned up');

        console.log('\n✅ All schema tests passed!\n');
        console.log('=== Test Complete ===\n');

        // Disconnect
        await disconnectDatabase();
        process.exit(0);

    } catch (error: any) {
        logError('Schema test failed', error);
        await disconnectDatabase();
        process.exit(1);
    }
}

// Run test
testSchemas();