// scripts/test-config.ts


import { dhanConfig, tradingConfig, databaseConfig } from '../src/config';

console.log('=== Configuration Test ===\n');

console.log('1. Dhan Config:');
console.log('   Client ID:', dhanConfig.clientId ? '✅ Set' : '❌ Missing');
console.log('   Access Token:', dhanConfig.accessToken ? '✅ Set' : '❌ Missing');
console.log('   Configured:', dhanConfig.isConfigured() ? '✅ Yes' : '❌ No');
console.log('   WebSocket URL:', dhanConfig.websocket.url);

console.log('\n2. Trading Config:');
console.log('   Initial Capital:', tradingConfig.capital.initial);
console.log('   Risk per Trade:', tradingConfig.risk.maxRiskPerTradePercent + '%');
console.log('   Daily Loss Limit:', tradingConfig.risk.dailyLossLimitPercent + '%');
console.log('   Max Positions:', tradingConfig.risk.maxOpenPositions);
const validation = tradingConfig.validate();
console.log('   Valid:', validation.valid ? '✅ Yes' : '❌ No');
if (!validation.valid) {
    console.log('   Errors:', validation.errors);
}

console.log('\n3. Database Config:');
console.log('   URI:', databaseConfig.uri);
console.log('   Database Name:', databaseConfig.dbName);
console.log('   Configured:', databaseConfig.isConfigured() ? '✅ Yes' : '❌ No');

console.log('\n=== Test Complete ===');