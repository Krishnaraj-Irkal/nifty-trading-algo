// src/utils/error-recovery.ts

import { logWarn, logError, logInfo } from './logger';
import { DatabaseError, WebSocketError } from '../errors';

/**
 * Error Recovery Mechanisms
 */

/**
 * Recover from database errors
 */
export async function recoverFromDatabaseError(
    error: DatabaseError,
    retryFn: () => Promise<any>
): Promise<any> {
    logWarn('Attempting to recover from database error', {
        operation: error.operation,
        collection: error.collection,
    });

    // Wait a bit before retry
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
        const result = await retryFn();
        logInfo('Successfully recovered from database error');
        return result;
    } catch (retryError) {
        logError('Failed to recover from database error', retryError as Error);
        throw retryError;
    }
}

/**
 * Recover from WebSocket errors
 */
export async function recoverFromWebSocketError(
    error: WebSocketError,
    reconnectFn: () => Promise<void>
): Promise<void> {
    logWarn('Attempting to recover from WebSocket error', {
        connectionId: error.connectionId,
        event: error.event,
    });

    // Exponential backoff
    const delays = [1000, 2000, 5000, 10000, 30000]; // ms

    for (let i = 0; i < delays.length; i++) {
        try {
            await new Promise(resolve => setTimeout(resolve, delays[i]));
            await reconnectFn();
            logInfo('Successfully recovered from WebSocket error');
            return;
        } catch (retryError) {
            logWarn(`WebSocket reconnection attempt ${i + 1} failed`);

            if (i === delays.length - 1) {
                logError('Failed to recover from WebSocket error', retryError as Error);
                throw retryError;
            }
        }
    }
}

/**
 * Graceful shutdown handler
 */
export async function gracefulShutdown(
    cleanupFn: () => Promise<void>,
    exitCode: number = 0
): Promise<void> {
    logWarn('Initiating graceful shutdown...');

    try {
        // Set timeout for cleanup
        const timeout = setTimeout(() => {
            logError('Cleanup timeout - forcing shutdown');
            process.exit(1);
        }, 30000); // 30 seconds

        // Run cleanup
        await cleanupFn();

        clearTimeout(timeout);
        logInfo('Graceful shutdown completed');
        process.exit(exitCode);
    } catch (error) {
        logError('Error during graceful shutdown', error as Error);
        process.exit(1);
    }
}