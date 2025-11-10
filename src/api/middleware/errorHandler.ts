// src/api/middleware/errorHandler.ts

import { NextResponse } from 'next/server';
import { BaseError } from '../../errors';
import { formatErrorResponse } from '../../utils/error-handler';
import { logError } from '../../utils/logger';

/**
 * Error handler middleware for Next.js API routes
 */

export function withErrorHandler(handler: Function) {
    return async (request: Request, context?: any) => {
        try {
            return await handler(request, context);
        } catch (error) {
            // Log error
            logError('API Error', error as Error, {
                url: request.url,
                method: request.method,
            });

            // Format error response
            const errorResponse = formatErrorResponse(error as Error);

            // Get status code
            const statusCode = error instanceof BaseError
                ? error.statusCode
                : 500;

            // Return error response
            return NextResponse.json(errorResponse, { status: statusCode });
        }
    };
}

/**
 * Async route handler wrapper
 */
export function asyncRoute(handler: Function) {
    return withErrorHandler(handler);
}