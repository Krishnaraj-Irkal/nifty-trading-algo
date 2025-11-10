// src/config/database.config.ts

import { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
/**
 * Database Configuration Types
 */

interface RetryConfig {
    attempts: number;
    delay: number;
    factor: number;
}

interface TimeSeriesConfig {
    timeField: string;
    metaField: string;
    granularity: string;
    expireAfterSeconds?: number;
}

interface IndexDefinition {
    keys: Record<string, number>;
    options?: Record<string, unknown>;
}

interface DatabaseConfig {
    uri: string;
    dbName: string;
    options: ConnectOptions;
    retry: RetryConfig;
    collections: Record<string, string>;
    timeSeriesOptions: {
        ticks: TimeSeriesConfig;
        candles: TimeSeriesConfig;
    };
    indexes: Record<string, IndexDefinition[]>;
    isConfigured: () => boolean;
}

/**
 * MongoDB Database Configuration
 */
const databaseConfig: DatabaseConfig = {
    uri: process.env.MONGODB_URI,
    dbName: 'nifty-algo-trader',

    options: {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        retryWrites: true,
    } as ConnectOptions,

    retry: {
        attempts: 5,
        delay: 3000,
        factor: 2,
    },

    collections: {
        ticks: 'ticks',
        candles: 'candles',
        trades: 'trades',
        signals: 'signals',
        strategies: 'strategies',
        portfolio: 'portfolio',
        performanceLogs: 'performance_logs',
        orders: 'orders',
        positions: 'positions',
    },

    timeSeriesOptions: {
        ticks: {
            timeField: 'timestamp',
            metaField: 'symbol',
            granularity: 'seconds',
            expireAfterSeconds: 604800,
        },
        candles: {
            timeField: 'timestamp',
            metaField: 'symbol',
            granularity: 'minutes',
        },
    },

    indexes: {
        candles: [
            { keys: { symbol: 1, timeframe: 1, timestamp: -1 } },
            { keys: { timestamp: -1 } },
        ],
        trades: [
            { keys: { strategy: 1, timestamp: -1 } },
            { keys: { status: 1 } },
        ],
        signals: [
            { keys: { symbol: 1, timestamp: -1 } },
            { keys: { executed: 1 } },
        ],
    },

    isConfigured(): boolean {
        return !!this.uri;
    },
};

export default databaseConfig;
export type { DatabaseConfig, RetryConfig, TimeSeriesConfig, IndexDefinition };