#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Check if we're in a build environment with DATABASE_URL
  if (process.env.DATABASE_URL) {
    console.log('🗄️ Setting up database...');
    
    // Push database schema
    execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
    
    // Seed database
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });
  } else {
    console.log('⚠️ DATABASE_URL not found, skipping database operations');
  }

  // Build Next.js application
  console.log('🏗️ Building Next.js application...');
  execSync('npx next build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}