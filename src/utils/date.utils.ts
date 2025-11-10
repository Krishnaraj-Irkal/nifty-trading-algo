// src/utils/date.utils.ts

import { format, parse, isWeekend, addDays, differenceInMinutes } from 'date-fns';

/**
 * Date and Time Utilities for Trading
 * Handles market hours, holidays, and time conversions
 */

// Market timings (IST)
export const MARKET_TIMINGS = {
    PRE_MARKET_START: '09:00',
    MARKET_OPEN: '09:15',
    LUNCH_START: '11:30',
    LUNCH_END: '13:00',
    MARKET_CLOSE: '15:30',
    POST_MARKET_END: '16:00',
};

// Indian stock market holidays 2024-2025 (update annually)
const MARKET_HOLIDAYS_2024: string[] = [
    '2024-01-26', // Republic Day
    '2024-03-08', // Mahashivratri
    '2024-03-25', // Holi
    '2024-03-29', // Good Friday
    '2024-04-11', // Id-Ul-Fitr
    '2024-04-17', // Ram Navami
    '2024-04-21', // Mahavir Jayanti
    '2024-05-01', // Maharashtra Day
    '2024-06-17', // Bakri Id
    '2024-07-17', // Muharram
    '2024-08-15', // Independence Day
    '2024-10-02', // Gandhi Jayanti
    '2024-10-12', // Dussehra
    '2024-11-01', // Diwali
    '2024-11-15', // Gurupurab
    '2024-12-25', // Christmas
];

const MARKET_HOLIDAYS_2025: string[] = [
    '2025-01-26', // Republic Day
    '2025-02-26', // Mahashivratri
    '2025-03-14', // Holi
    '2025-03-31', // Id-Ul-Fitr
    '2025-04-10', // Mahavir Jayanti
    '2025-04-14', // Ambedkar Jayanti
    '2025-04-18', // Good Friday
    '2025-05-01', // Maharashtra Day
    '2025-06-07', // Bakri Id
    '2025-08-15', // Independence Day
    '2025-08-27', // Janmashtami
    '2025-10-02', // Gandhi Jayanti
    '2025-10-21', // Dussehra
    '2025-11-01', // Diwali (Laxmi Pujan)
    '2025-11-05', // Gurupurab
    '2025-12-25', // Christmas
];

const ALL_HOLIDAYS = [...MARKET_HOLIDAYS_2024, ...MARKET_HOLIDAYS_2025];

/**
 * Check if given date is a market holiday
 */
export function isMarketHoliday(date: Date = new Date()): boolean {
    const dateStr = format(date, 'yyyy-MM-dd');
    return ALL_HOLIDAYS.includes(dateStr);
}

/**
 * Check if market is open on given date
 */
export function isMarketOpenDay(date: Date = new Date()): boolean {
    // Check if weekend
    if (isWeekend(date)) {
        return false;
    }

    // Check if holiday
    if (isMarketHoliday(date)) {
        return false;
    }

    return true;
}

/**
 * Check if current time is within market hours
 */
export function isMarketOpen(date: Date = new Date()): boolean {
    // Check if it's a trading day
    if (!isMarketOpenDay(date)) {
        return false;
    }

    const currentTime = format(date, 'HH:mm');
    return currentTime >= MARKET_TIMINGS.MARKET_OPEN &&
        currentTime <= MARKET_TIMINGS.MARKET_CLOSE;
}

/**
 * Check if current time is in pre-market session
 */
export function isPreMarket(date: Date = new Date()): boolean {
    if (!isMarketOpenDay(date)) {
        return false;
    }

    const currentTime = format(date, 'HH:mm');
    return currentTime >= MARKET_TIMINGS.PRE_MARKET_START &&
        currentTime < MARKET_TIMINGS.MARKET_OPEN;
}

/**
 * Check if current time is in post-market session
 */
export function isPostMarket(date: Date = new Date()): boolean {
    if (!isMarketOpenDay(date)) {
        return false;
    }

    const currentTime = format(date, 'HH:mm');
    return currentTime > MARKET_TIMINGS.MARKET_CLOSE &&
        currentTime <= MARKET_TIMINGS.POST_MARKET_END;
}

/**
 * Check if current time is lunch hour
 */
export function isLunchHour(date: Date = new Date()): boolean {
    const currentTime = format(date, 'HH:mm');
    return currentTime >= MARKET_TIMINGS.LUNCH_START &&
        currentTime < MARKET_TIMINGS.LUNCH_END;
}

/**
 * Get market session (PRE_MARKET, MARKET_OPEN, LUNCH, POST_MARKET, CLOSED)
 */
export function getMarketSession(date: Date = new Date()): string {
    if (!isMarketOpenDay(date)) {
        return 'CLOSED';
    }

    const currentTime = format(date, 'HH:mm');

    if (currentTime >= MARKET_TIMINGS.PRE_MARKET_START &&
        currentTime < MARKET_TIMINGS.MARKET_OPEN) {
        return 'PRE_MARKET';
    }

    if (currentTime >= MARKET_TIMINGS.MARKET_OPEN &&
        currentTime < MARKET_TIMINGS.LUNCH_START) {
        return 'MORNING_SESSION';
    }

    if (currentTime >= MARKET_TIMINGS.LUNCH_START &&
        currentTime < MARKET_TIMINGS.LUNCH_END) {
        return 'LUNCH_BREAK';
    }

    if (currentTime >= MARKET_TIMINGS.LUNCH_END &&
        currentTime <= MARKET_TIMINGS.MARKET_CLOSE) {
        return 'AFTERNOON_SESSION';
    }

    if (currentTime > MARKET_TIMINGS.MARKET_CLOSE &&
        currentTime <= MARKET_TIMINGS.POST_MARKET_END) {
        return 'POST_MARKET';
    }

    return 'CLOSED';
}

/**
 * Get next market open time
 */
export function getNextMarketOpen(date: Date = new Date()): Date {
    let nextDate = new Date(date);

    // If market is currently open, return current date
    if (isMarketOpen(nextDate)) {
        return nextDate;
    }

    // Keep adding days until we find a trading day
    while (!isMarketOpenDay(nextDate)) {
        nextDate = addDays(nextDate, 1);
    }

    // Set time to market open
    const [hours, minutes] = MARKET_TIMINGS.MARKET_OPEN.split(':');
    nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return nextDate;
}

/**
 * Parse time string to Date object (today's date with given time)
 */
export function parseTimeToday(timeStr: string): Date {
    const today = format(new Date(), 'yyyy-MM-dd');
    return parse(`${today} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
}

/**
 * Check if given time is within trading window
 */
export function isWithinTradingWindow(
    currentTime: Date,
    startTime: string,
    endTime: string
): boolean {
    const start = parseTimeToday(startTime);
    const end = parseTimeToday(endTime);

    return currentTime >= start && currentTime <= end;
}

/**
 * Get minutes since market open
 */
export function getMinutesSinceMarketOpen(date: Date = new Date()): number {
    const marketOpen = parseTimeToday(MARKET_TIMINGS.MARKET_OPEN);
    return differenceInMinutes(date, marketOpen);
}

/**
 * Get minutes until market close
 */
export function getMinutesUntilMarketClose(date: Date = new Date()): number {
    const marketClose = parseTimeToday(MARKET_TIMINGS.MARKET_CLOSE);
    return differenceInMinutes(marketClose, date);
}

/**
 * Format date for display
 */
export function formatDate(date: Date, formatStr: string = 'yyyy-MM-dd'): string {
    return format(date, formatStr);
}

/**
 * Format time for display
 */
export function formatTime(date: Date, formatStr: string = 'HH:mm:ss'): string {
    return format(date, formatStr);
}

/**
 * Format datetime for display
 */
export function formatDateTime(date: Date, formatStr: string = 'yyyy-MM-dd HH:mm:ss'): string {
    return format(date, formatStr);
}

/**
 * Check if opening range period (9:15 - 9:30)
 */
export function isOpeningRangePeriod(date: Date = new Date()): boolean {
    return isWithinTradingWindow(date, '09:15', '09:30');
}

/**
 * Check if it's near market close (last 15 minutes)
 */
export function isNearMarketClose(date: Date = new Date()): boolean {
    return isWithinTradingWindow(date, '15:15', '15:30');
}

/**
 * Get time of day category
 */
export function getTimeOfDay(date: Date = new Date()): string {
    const currentTime = format(date, 'HH:mm');

    if (currentTime >= '09:15' && currentTime < '10:00') {
        return 'OPENING';
    }
    if (currentTime >= '10:00' && currentTime < '11:30') {
        return 'MORNING';
    }
    if (currentTime >= '11:30' && currentTime < '13:00') {
        return 'LUNCH';
    }
    if (currentTime >= '13:00' && currentTime < '14:30') {
        return 'AFTERNOON';
    }
    if (currentTime >= '14:30' && currentTime <= '15:30') {
        return 'CLOSING';
    }

    return 'CLOSED';
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}