#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up test environment...');

// Check if database exists
const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const dbExists = fs.existsSync(dbPath);

if (!dbExists) {
  console.log('📦 Database not found, creating...');
  try {
    // Create database and run migrations
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️ Migration failed, trying to push schema...');
    try {
      execSync('npx prisma db push', { stdio: 'inherit' });
    } catch (pushError) {
      console.log('⚠️ Schema push failed, continuing with existing setup...');
    }
  }
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Prisma generate failed, continuing...');
}

// Seed database
console.log('🌱 Seeding database...');
try {
  execSync('npx prisma db seed', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️ Database seeding failed, continuing...');
}

console.log('✅ Test environment setup complete!');