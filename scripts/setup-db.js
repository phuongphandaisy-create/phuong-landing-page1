const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up database...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  // Run seed script
  console.log('🌱 Running database seed...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

  console.log('✅ Database setup completed successfully!');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}