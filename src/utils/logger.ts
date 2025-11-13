// src/utils/logger.ts

import '../config/env';

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';


/**
 * Professional Logging System
 * Uses Winston with console and file transports
 */

// Log levels
const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
};

// Colors for each log level
const LOG_COLORS = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
};

// Add colors to Winston
winston.addColors(LOG_COLORS);

// Get log level from environment (default: info)
const LOG_LEVEL = process.env.NEXT_PUBLIC_LOG_LEVEL || 'info';

// Logs directory
const LOGS_DIR = path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Custom format for console output
 * Example: [2024-01-15 10:30:45] INFO: Application started
 */
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
        const { timestamp, level, message, ...metadata } = info;

        let log = `[${timestamp}] ${level}: ${message}`;

        // Add metadata if present
        if (Object.keys(metadata).length > 0) {
            log += `\n${JSON.stringify(metadata, null, 2)}`;
        }

        return log;
    })
);

/**
 * Custom format for file output
 * JSON format for easy parsing
 */
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

/**
 * Console transport (for development)
 */
const consoleTransport = new winston.transports.Console({
    format: consoleFormat,
    level: LOG_LEVEL,
});

/**
 * File transport - All logs (daily rotation)
 */
const allLogsTransport = new DailyRotateFile({
    filename: path.join(LOGS_DIR, 'app-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m', // 20MB per file
    maxFiles: '14d', // Keep 14 days
    format: fileFormat,
    level: LOG_LEVEL,
});

/**
 * File transport - Error logs only (daily rotation)
 */
const errorLogsTransport = new DailyRotateFile({
    filename: path.join(LOGS_DIR, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '30d', // Keep errors for 30 days
    format: fileFormat,
    level: 'error',
});

/**
 * Create Winston logger instance
 */
const logger = winston.createLogger({
    levels: LOG_LEVELS,
    transports: [
        consoleTransport,
        allLogsTransport,
        errorLogsTransport,
    ],
    exitOnError: false, // Don't exit on handled exceptions
});

/**
 * Stream for Morgan HTTP logger (for future use)
 */
export const loggerStream = {
    write: (message: string) => {
        logger.info(message.trim());
    },
};

/**
 * Enhanced logging functions with context
 */

// Log error with stack trace
export function logError(message: string, error?: any, metadata?: Record<string, any>): void {
    const logData: any = {
        message,
        ...metadata,
    };

    if (error) {
        logData.error = {
            message: error.message,
            stack: error.stack,
            ...error,
        };
    }

    logger.error(logData);
}

// Log warning
export function logWarn(message: string, metadata?: Record<string, any>): void {
    logger.warn({ message, ...metadata });
}

// Log info
export function logInfo(message: string, metadata?: Record<string, any>): void {
    logger.info({ message, ...metadata });
}

// Log debug
export function logDebug(message: string, metadata?: Record<string, any>): void {
    logger.debug({ message, ...metadata });
}

/**
 * Log database operations
 */
export function logDatabase(operation: string, details?: Record<string, any>): void {
    logger.info({
        type: 'database',
        operation,
        ...details,
    });
}

/**
 * Log WebSocket events
 */
export function logWebSocket(event: string, details?: Record<string, any>): void {
    logger.info({
        type: 'websocket',
        event,
        ...details,
    });
}

/**
 * Log trading signals
 */
export function logSignal(signal: string, details?: Record<string, any>): void {
    logger.info({
        type: 'signal',
        signal,
        ...details,
    });
}

/**
 * Log trade execution
 */
export function logTrade(action: string, details?: Record<string, any>): void {
    logger.info({
        type: 'trade',
        action,
        ...details,
    });
}

/**
 * Log performance metrics
 */
export function logPerformance(metric: string, value: number, unit?: string): void {
    logger.info({
        type: 'performance',
        metric,
        value,
        unit,
    });
}

/**
 * Log API requests (for future use)
 */
export function logAPI(method: string, endpoint: string, status?: number, duration?: number): void {
    logger.info({
        type: 'api',
        method,
        endpoint,
        status,
        duration,
    });
}

/**
 * Create a child logger with default metadata
 */
export function createLogger(defaultMetadata: Record<string, any>) {
    return {
        error: (message: string, metadata?: Record<string, any>) =>
            logError(message, undefined, { ...defaultMetadata, ...metadata }),
        warn: (message: string, metadata?: Record<string, any>) =>
            logWarn(message, { ...defaultMetadata, ...metadata }),
        info: (message: string, metadata?: Record<string, any>) =>
            logInfo(message, { ...defaultMetadata, ...metadata }),
        debug: (message: string, metadata?: Record<string, any>) =>
            logDebug(message, { ...defaultMetadata, ...metadata }),
    };
}

/**
 * Get logger instance (for advanced use)
 */
export function getLogger(): winston.Logger {
    return logger;
}

// Export default logger
export default logger;
