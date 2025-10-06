import { connectToDatabase } from './database/mongoose';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
config({ path: join(process.cwd(), '.env.local') });

/**
 * Test script to verify MongoDB connection
 */
async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing database connection...');

    // Test the connection
    const connection = await connectToDatabase();

    if (connection) {
      console.log('✅ Database connection successful!');
      console.log(`📊 Connection state: ${connection.connection.readyState}`);
      console.log(`🏠 Database name: ${connection.connection.name}`);
      console.log(`🌐 Host: ${connection.connection.host}`);
      console.log(`🔌 Port: ${connection.connection.port}`);

      // Test a simple operation
      if (connection.connection.db) {
        const collections = await connection.connection.db
          .listCollections()
          .toArray();
        console.log(`📁 Available collections: ${collections.length}`);

        if (collections.length > 0) {
          console.log('📋 Collection names:');
          collections.forEach((collection, index) => {
            console.log(`   ${index + 1}. ${collection.name}`);
          });
        }
      } else {
        console.log('📁 Database instance not available');
      }

      // Close the connection for testing purposes
      await connection.connection.close();
      console.log('🔚 Connection closed successfully');
    } else {
      console.log('❌ Failed to establish database connection');
    }
  } catch (error) {
    console.error('❌ Database connection error:');
    console.error(error instanceof Error ? error.message : error);

    if (error instanceof Error) {
      if (error.message.includes('MONGODB_URI')) {
        console.log(
          '\n💡 Solution: Create a .env.local file with your MongoDB URI'
        );
      } else if (
        error.message.includes('ENOTFOUND') ||
        error.message.includes('ECONNREFUSED')
      ) {
        console.log(
          '\n💡 Solution: Check if your MongoDB server is running and accessible'
        );
      }
    }
  }
}

// Run the test
testDatabaseConnection();
