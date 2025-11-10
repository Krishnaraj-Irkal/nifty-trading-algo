// src/config/index.ts

/**
 * Central Configuration Export
 * Import all configs from one place
 */

import dhanConfig from './dhan.config';
import tradingConfig from './trading.config';
import databaseConfig from './database.config';

export {
  dhanConfig,
  tradingConfig,
  databaseConfig,
};

export type { DhanConfig } from './dhan.config';
export type { TradingConfig } from './trading.config';
export type { DatabaseConfig } from './database.config';