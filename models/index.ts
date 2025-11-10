// models/index.ts

/**
 * Central export for all models
 */

import Tick from './Tick';
import Candle from './Candle';
import Signal from './Signal';
import Order from './Order';
import Position from './Position';
import Trade from './Trade';
import Portfolio from './Portfolio';

export {
    Tick,
    Candle,
    Signal,
    Order,
    Position,
    Trade,
    Portfolio,
};

// Export types
export type { ITickDocument } from './Tick';
export type { ICandleDocument } from './Candle';
export type { ISignalDocument } from './Signal';
export type { IOrderDocument } from './Order';
export type { IPositionDocument } from './Position';
export type { ITradeDocument } from './Trade';
export type { IPortfolioDocument } from './Portfolio';