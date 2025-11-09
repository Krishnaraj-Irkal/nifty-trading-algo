// src/config/dhan.config.ts

/**
 * Dhan API Configuration
 * Manages all Dhan-related settings and credentials
 */

// Type definitions
interface WebSocketConfig {
    url: string;
    version: string;
    authType: string;
    maxConnections: number;
    instrumentsPerConnection: number;
    instrumentsPerMessage: number;
    pingInterval: number;
    pongTimeout: number;
    reconnectAttempts: number;
    reconnectDelay: number;
    reconnectDelayMax: number;
}

interface RequestCodes {
    ticker: number;
    quote: number;
    full: number;
    disconnect: number;
}

interface ResponseCodes {
    ticker: number;
    quote: number;
    full: number;
    prevClose: number;
    oiData: number;
    disconnect: number;
}

interface Exchanges {
    NSE_EQ: string;
    NSE_FNO: string;
    BSE_EQ: string;
    BSE_FNO: string;
    MCX_COMM: string;
}

interface Instrument {
    exchange: string;
    securityId: string;
}

interface Instruments {
    nifty50: Instrument;
    bankNifty: Instrument;
}

interface DhanConfig {
    clientId: string;
    accessToken: string;
    websocket: WebSocketConfig;
    requestCodes: RequestCodes;
    responseCodes: ResponseCodes;
    exchanges: Exchanges;
    instruments: Instruments;
    isConfigured: () => boolean;
    getWebSocketUrl: () => string;
}

// Configuration object
const dhanConfig: DhanConfig = {
    // API Credentials
    clientId: process.env.DHAN_CLIENT_ID || '',
    accessToken: process.env.DHAN_ACCESS_TOKEN || '',

    // WebSocket Configuration
    websocket: {
        url: process.env.DHAN_WEBSOCKET_URL || 'wss://api-feed.dhan.co',
        version: process.env.WEBSOCKET_VERSION || '2',
        authType: process.env.WEBSOCKET_AUTH_TYPE || '2',

        // Connection settings
        maxConnections: 5,
        instrumentsPerConnection: 5000,
        instrumentsPerMessage: 100,

        // Keep-alive settings
        pingInterval: 10000,
        pongTimeout: 40000,

        // Reconnection settings
        reconnectAttempts: 5,
        reconnectDelay: 3000,
        reconnectDelayMax: 30000,
    },

    // Request Codes
    requestCodes: {
        ticker: 15,
        quote: 17,
        full: 19,
        disconnect: 12,
    },

    // Response Codes
    responseCodes: {
        ticker: 2,
        quote: 4,
        full: 8,
        prevClose: 6,
        oiData: 5,
        disconnect: 50,
    },

    // Exchange Segments
    exchanges: {
        NSE_EQ: 'NSE_EQ',
        NSE_FNO: 'NSE_FNO',
        BSE_EQ: 'BSE_EQ',
        BSE_FNO: 'BSE_FNO',
        MCX_COMM: 'MCX_COMM',
    },

    // Instruments to subscribe
    instruments: {
        nifty50: {
            exchange: 'NSE_EQ',
            securityId: '13',
        },
        bankNifty: {
            exchange: 'NSE_EQ',
            securityId: '25',
        },
    },

    // Validation
    isConfigured(): boolean {
        return !!(this.clientId && this.accessToken);
    },

    // Get WebSocket connection URL
    getWebSocketUrl(): string {
        return `${this.websocket.url}?version=${this.websocket.version}&token=${this.accessToken}&clientId=${this.clientId}&authType=${this.websocket.authType}`;
    },
};

export default dhanConfig;

// Export types for use in other files
export type {
    DhanConfig,
    WebSocketConfig,
    RequestCodes,
    ResponseCodes,
    Exchanges,
    Instrument,
    Instruments,
};