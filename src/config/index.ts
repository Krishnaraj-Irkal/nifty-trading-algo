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
