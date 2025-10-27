#!/usr/bin/env node

/**
 * Migration script from SQLite to PostgreSQL
 * This script helps migrate existing data if needed
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function migrateToPostgres() {
  console.log('🔄 Starting migration to PostgreSQL...');

  // Check if SQLite database exists
  const sqliteDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  const hasSqliteData = fs.existsSync(sqliteDbPath);

  if (!hasSqliteData) {
    console.log('ℹ️ No existing SQLite database found. Starting fresh with PostgreSQL.');
    return;
  }

  console.log('📊 Found existing SQLite database. Migration options:');
  console.log('1. Manual data export/import (recommended for production)');
  console.log('2. Fresh start with PostgreSQL (data will be lost)');
  console.log('3. Keep SQLite for development, use PostgreSQL for production');

  console.log('\n🔧 For manual migration:');
  console.log('1. Export your important data from SQLite');
  console.log('2. Set up PostgreSQL connection');
  console.log('3. Run: npx prisma db push');
  console.log('4. Import your data');

  console.log('\n✅ Migration guidance complete!');
}

// Run migration if called directly
if (require.main === module) {
  migrateToPostgres().catch(console.error);
}

module.exports = { migrateToPostgres };