
// src/core/database/connection.ts

import mongoose from 'mongoose';
import { databaseConfig } from '../../config';
import { logInfo, logError, logWarn, logDatabase } from '../../utils/logger';

/**
 * MongoDB Connection Manager
 * Handles connection, reconnection, and graceful shutdown
 */

// Connection state
let isConnected = false;
let connectionAttempts = 0;

/**
 * Connect to MongoDB with retry logic
 */
export async function connectDatabase(): Promise<void> {
    if (isConnected) {
        logInfo('MongoDB: Already connected');
        return;
    }

    if (mongoose.connection.readyState === 2) {
        logInfo('MongoDB: Connection in progress...');
        return;
    }

    try {
        logInfo('MongoDB: Attempting to connect...');
        logInfo(`MongoDB: URI: ${databaseConfig.uri}`);

        await mongoose.connect(databaseConfig.uri, databaseConfig.options);

        isConnected = true;
        connectionAttempts = 0;

        logInfo('MongoDB: Connected successfully');
        logInfo(`MongoDB: Database: ${databaseConfig.dbName}`);
        logDatabase('CONNECTED', { database: databaseConfig.dbName });

    } catch (error: any) {
        connectionAttempts++;

        logError('MongoDB: Connection failed', error, {
            attempt: connectionAttempts,
            maxAttempts: databaseConfig.retry.attempts,
        });

        if (connectionAttempts < databaseConfig.retry.attempts) {
            const delay = databaseConfig.retry.delay * Math.pow(databaseConfig.retry.factor, connectionAttempts - 1);
            logInfo(`MongoDB: Retrying in ${delay / 1000} seconds...`);

            await new Promise(resolve => setTimeout(resolve, delay));
            return connectDatabase();
        } else {
            logError('MongoDB: Max connection attempts reached');
            logError('MongoDB: Exiting application');
            process.exit(1);
        }
    }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
    if (!isConnected) {
        logInfo('MongoDB: Already disconnected');
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        logInfo('MongoDB: Disconnected successfully');
        logDatabase('DISCONNECTED');
    } catch (error: any) {
        logError('MongoDB: Error during disconnect', error);
    }
}

/**
 * Get connection status
 */
export function getDatabaseStatus(): {
    connected: boolean;
    readyState: string;
    host: string | undefined;
    name: string | undefined;
} {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

    return {
        connected: isConnected,
        readyState: states[mongoose.connection.readyState] || 'unknown',
        host: mongoose.connection.host,
        name: mongoose.connection.name,
    };
}

/**
 * Setup connection event listeners
 */
export function setupConnectionListeners(): void {

    mongoose.connection.on('connected', () => {
        logInfo('MongoDB Event: Connected');
        isConnected = true;
    });

    mongoose.connection.on('error', (error) => {
        logError('MongoDB Event: Error', error);
        isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
        logWarn('MongoDB Event: Disconnected');
        isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
        logInfo('MongoDB Event: Reconnected');
        isConnected = true;
    });

    mongoose.connection.on('timeout', () => {
        logWarn('MongoDB Event: Connection timeout');
    });

    process.on('SIGINT', async () => {
        logWarn('Process: SIGINT received, closing MongoDB connection...');
        await disconnectDatabase();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        logWarn('Process: SIGTERM received, closing MongoDB connection...');
        await disconnectDatabase();
        process.exit(0);
    });

    process.on('uncaughtException', async (error) => {
        logError('Process: Uncaught Exception', error);
        await disconnectDatabase();
        process.exit(1);
    });

    process.on('unhandledRejection', async (reason: any) => {
        logError('Process: Unhandled Rejection', reason);
        await disconnectDatabase();
        process.exit(1);
    });
}

/**
 * Initialize database connection
 */
export async function initializeDatabase(): Promise<void> {
    // Setup event listeners first
    setupConnectionListeners();

    // Then connect
    await connectDatabase();
}