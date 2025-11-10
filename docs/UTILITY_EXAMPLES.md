# Utility Functions Examples

## Date Utils

### Check Market Status
```typescript
import { isMarketOpen, getMarketSession } from '@/utils/date.utils';

if (isMarketOpen()) {
  console.log('Market is open!');
  console.log('Current session:', getMarketSession());
}
```

### Opening Range Detection
```typescript
import { isOpeningRangePeriod } from '@/utils/date.utils';

if (isOpeningRangePeriod()) {
  console.log('Opening range period (9:15-9:30)');
  // Start tracking opening range high/low
}
```

### Calculate Time in Trade
```typescript
import { differenceInMinutes } from 'date-fns';

const entryTime = new Date('2024-01-15T09:45:00');
const exitTime = new Date('2024-01-15T10:30:00');
const duration = differenceInMinutes(exitTime, entryTime);
console.log(`Trade duration: ${duration} minutes`);
```

## Math Utils

### Calculate Performance Metrics
```typescript
import { average, standardDeviation, sharpeRatio } from '@/utils/math.utils';

const dailyReturns = [2.5, -1.2, 3.1, 0.8, -0.5, 2.3, 1.5];

const avgReturn = average(dailyReturns);
const volatility = standardDeviation(dailyReturns);
const sharpe = sharpeRatio(dailyReturns);

console.log(`Average Return: ${avgReturn.toFixed(2)}%`);
console.log(`Volatility: ${volatility.toFixed(2)}%`);
console.log(`Sharpe Ratio: ${sharpe.toFixed(2)}`);
```

### Round Prices to Tick Size
```typescript
import { roundToTick } from '@/utils/math.utils';

const price = 22450.37;
const tickSize = 0.05;
const roundedPrice = roundToTick(price, tickSize);
console.log(roundedPrice); // 22450.35
```

### Calculate Moving Average
```typescript
import { movingAverage } from '@/utils/math.utils';

const prices = [100, 102, 104, 103, 105, 107, 106];
const sma5 = movingAverage(prices, 5);
console.log('5-period SMA:', sma5);
```

## Validators

### Validate Trade Before Execution
```typescript
import { validateTradeSetup } from '@/utils/validators';

const trade = {
  symbol: 'NIFTY',
  entryPrice: 22450,
  stopLoss: 22420,
  target: 22510,
  quantity: 50,
  direction: 'LONG' as const,
  confidence: 85,
};

const validation = validateTradeSetup(trade);

if (validation.valid) {
  // Execute trade
  console.log('Trade is valid, executing...');
} else {
  console.error('Trade validation failed:', validation.errors);
}
```

### Check Risk-Reward Ratio
```typescript
import { validateRiskRewardRatio } from '@/utils/validators';

const result = validateRiskRewardRatio(
  22450, // entry
  22420, // stop loss
  22510, // target
  'LONG',
  1.5    // minimum RR
);

if (result.valid) {
  console.log(`Risk-Reward ratio: ${result.ratio?.toFixed(2)}`);
} else {
  console.error(result.error);
}
```

## Schema Helpers

### Generate Unique IDs
```typescript
import { 
  generateTradeId, 
  generateSignalId, 
  generateOrderId 
} from '@/utils/schema-helpers';

const tradeId = generateTradeId();
const signalId = generateSignalId();
const orderId = generateOrderId();

console.log(tradeId);  // trade-1705307730123-a1b2c3d4
console.log(signalId); // signal-1705307730123-e5f6g7h8
console.log(orderId);  // order-1705307730123-i9j0k1l2
```

### Calculate P&L
```typescript
import { calculatePnL, calculatePnLPercent } from '@/utils/schema-helpers';

// LONG position
const pnl = calculatePnL(22450, 22510, 50, 'LONG');
console.log(`P&L: ₹${pnl}`); // ₹3000

const pnlPercent = calculatePnLPercent(22450, 22510, 'LONG');
console.log(`P&L %: ${pnlPercent.toFixed(2)}%`); // 0.27%

// SHORT position
const pnlShort = calculatePnL(22450, 22410, 50, 'SHORT');
console.log(`P&L: ₹${pnlShort}`); // ₹2000
```

## Combined Example: Complete Trade Workflow
```typescript
import { 
  isMarketOpen, 
  isOpeningRangePeriod,
  formatDateTime 
} from '@/utils/date.utils';
import { 
  validateTradeSetup,
  validateRiskRewardRatio 
} from '@/utils/validators';
import { 
  generateTradeId,
  calculatePnL 
} from '@/utils/schema-helpers';
import { round, formatCurrency } from '@/utils/math.utils';
import { logInfo, logTrade } from '@/utils/logger';

// 1. Check market conditions
if (!isMarketOpen()) {
  logInfo('Market is closed, cannot trade');
  process.exit(0);
}

// 2. Setup trade parameters
const tradeSetup = {
  symbol: 'NIFTY',
  entryPrice: 22450,
  stopLoss: 22420,
  target: 22510,
  quantity: 50,
  direction: 'LONG' as const,
  confidence: 85,
};

// 3. Validate trade
const validation = validateTradeSetup(tradeSetup);

if (!validation.valid) {
  console.error('Trade validation failed:', validation.errors);
  process.exit(1);
}

// 4. Check risk-reward
const rrCheck = validateRiskRewardRatio(
  tradeSetup.entryPrice,
  tradeSetup.stopLoss,
  tradeSetup.target,
  tradeSetup.direction
);

logInfo('Risk-Reward Ratio', { ratio: rrCheck.ratio });

// 5. Generate trade ID
const tradeId = generateTradeId();

// 6. Calculate potential P&L
const potentialProfit = calculatePnL(
  tradeSetup.entryPrice,
  tradeSetup.target,
  tradeSetup.quantity,
  tradeSetup.direction
);

const potentialLoss = calculatePnL(
  tradeSetup.entryPrice,
  tradeSetup.stopLoss,
  tradeSetup.quantity,
  tradeSetup.direction
);

// 7. Log trade details
logTrade('ENTRY', {
  tradeId,
  ...tradeSetup,
  timestamp: formatDateTime(new Date()),
  potentialProfit: formatCurrency(potentialProfit),
  potentialLoss: formatCurrency(potentialLoss),
});

console.log('Trade ready for execution!');
```