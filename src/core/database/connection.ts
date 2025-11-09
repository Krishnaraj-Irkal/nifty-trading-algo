
// src/core/database/connection.ts

import mongoose from 'mongoose';
import { databaseConfig } from '../../config';

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
    // If already connected, skip
    if (isConnected) {
        console.log('📦 MongoDB: Already connected');
        return;
    }

    // If connection is in progress, wait
    if (mongoose.connection.readyState === 2) {
        console.log('📦 MongoDB: Connection in progress...');
        return;
    }

    try {
        console.log('📦 MongoDB: Attempting to connect...');
        console.log(`📦 MongoDB: URI: ${databaseConfig.uri.replace(/\/\/.*@/, '//***@')}`); // Hide credentials in log

        // Connect to MongoDB
        await mongoose.connect(databaseConfig.uri, databaseConfig.options);

        isConnected = true;
        connectionAttempts = 0;

        console.log('✅ MongoDB: Connected successfully');
        console.log(`✅ MongoDB: Database: ${databaseConfig.dbName}`);

    } catch (error) {
        connectionAttempts++;

        console.error('❌ MongoDB: Connection failed');
        console.error(`❌ MongoDB: Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`❌ MongoDB: Attempt ${connectionAttempts}/${databaseConfig.retry.attempts}`);

        // Retry logic
        if (connectionAttempts < databaseConfig.retry.attempts) {
            const delay = databaseConfig.retry.delay * Math.pow(databaseConfig.retry.factor, connectionAttempts - 1);
            console.log(`🔄 MongoDB: Retrying in ${delay / 1000} seconds...`);

            await new Promise(resolve => setTimeout(resolve, delay));
            return connectDatabase(); // Recursive retry
        } else {
            console.error('❌ MongoDB: Max connection attempts reached');
            console.error('❌ MongoDB: Exiting application');
            process.exit(1);
        }
    }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectDatabase(): Promise<void> {
    if (!isConnected) {
        console.log('📦 MongoDB: Already disconnected');
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('✅ MongoDB: Disconnected successfully');
    } catch (error: unknown) {
        console.error('❌ MongoDB: Error during disconnect:', error instanceof Error ? error.message : 'Unknown error');
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

    // Connected event
    mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB Event: Connected');
        isConnected = true;
    });

    // Error event
    mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB Event: Error:', error.message);
        isConnected = false;
    });

    // Disconnected event
    mongoose.connection.on('disconnected', () => {
        console.log('⚠️  MongoDB Event: Disconnected');
        isConnected = false;
    });

    // Reconnected event
    mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB Event: Reconnected');
        isConnected = true;
    });

    // Connection timeout
    mongoose.connection.on('timeout', () => {
        console.error('⏱️  MongoDB Event: Connection timeout');
    });

    // When Node process ends, close connection
    process.on('SIGINT', async () => {
        console.log('\n⚠️  Process: SIGINT received, closing MongoDB connection...');
        await disconnectDatabase();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        console.log('\n⚠️  Process: SIGTERM received, closing MongoDB connection...');
        await disconnectDatabase();
        process.exit(0);
    });

    // Uncaught exceptions
    process.on('uncaughtException', async (error) => {
        console.error('❌ Process: Uncaught Exception:', error);
        await disconnectDatabase();
        process.exit(1);
    });

    // Unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
        console.error('❌ Process: Unhandled Rejection at:', promise);
        console.error('❌ Process: Reason:', reason);
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