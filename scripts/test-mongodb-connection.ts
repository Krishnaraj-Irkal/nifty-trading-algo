// scripts/test-mongodb-connection.ts

// Load .env.local first (before any imports)
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Now import everything else
import { initializeDatabase, getDatabaseStatus, disconnectDatabase } from '../src/core/database/connection';

/**
 * Test MongoDB connection
 */
async function testConnection(): Promise<void> {
    console.log('=== MongoDB Connection Test ===\n');

    try {
        console.log('1. Initializing database connection...');
        await initializeDatabase();

        console.log('\n2. Checking connection status...');
        const status = getDatabaseStatus();
        console.log('   Status:', status);
        console.log('   Connected:', status.connected ? '✅ Yes' : '❌ No');
        console.log('   Ready State:', status.readyState);
        console.log('   Host:', status.host || 'N/A');
        console.log('   Database:', status.name || 'N/A');

        console.log('\n3. Connection is stable, waiting 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('\n4. Disconnecting...');
        await disconnectDatabase();

        console.log('\n✅ Test completed successfully!');
        console.log('\n=== Test Complete ===');

        process.exit(0);

    } catch (error: any) {
        console.error('\n❌ Test failed!');
        console.error('Error:', error?.message || error);
        process.exit(1);
    }
}

// Run test
testConnection();