#!/usr/bin/env node

/**
 * Database Setup Script
 * This script helps verify the PostgreSQL connection and create the database if needed
 */

const { Client } = require('pg');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce_db',
};

console.log('\n🔧 PostgreSQL Database Setup\n');
console.log('Connection Details:');
console.log(`  Host:     ${dbConfig.host}`);
console.log(`  Port:     ${dbConfig.port}`);
console.log(`  User:     ${dbConfig.username}`);
console.log(`  Database: ${dbConfig.database}\n`);

// Step 1: Test default connection to postgres database
async function testConnection() {
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres', // Connect to default postgres database first
  });

  try {
    console.log('⏳ Testing PostgreSQL connection...');
    await client.connect();
    console.log('✅ PostgreSQL connection successful!\n');

    // Check if ecommerce_db exists
    console.log('⏳ Checking if database exists...');
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbConfig.database]
    );

    if (result.rows.length === 0) {
      console.log(`❌ Database '${dbConfig.database}' does not exist.`);
      console.log('⏳ Creating database...');
      
      await client.query(`CREATE DATABASE ${dbConfig.database}`);
      console.log(`✅ Database '${dbConfig.database}' created successfully!\n`);
    } else {
      console.log(`✅ Database '${dbConfig.database}' already exists.\n`);
    }

    await client.end();
    console.log('✅ Database setup complete!\n');
    console.log('You can now run: npm run dev\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('1. Ensure PostgreSQL service is running');
    console.error('2. Check that the password in .env is correct');
    console.error('3. On Windows, check: Services > Start postgresql-x64-18 service');
    console.error('4. Try testing with: psql -U postgres\n');
    process.exit(1);
  }
}

testConnection();
