#!/usr/bin/env node

/**
 * Setup script for Vercel Postgres
 * This script helps configure the project for Vercel Postgres deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Vercel Postgres configuration...');

// Check if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';

console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
console.log(`Platform: ${isVercel ? 'Vercel' : 'Local'}`);

// Update package.json build script for Vercel
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Ensure build script works with Vercel Postgres
if (!packageJson.scripts.build.includes('prisma generate')) {
  packageJson.scripts.build = 'prisma generate && prisma db push && next build';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated build script for Vercel deployment');
}

// Create Vercel-specific environment file
const vercelEnvPath = path.join(process.cwd(), '.env.production');
if (!fs.existsSync(vercelEnvPath)) {
  const envContent = `# Vercel Postgres Environment
# DATABASE_URL will be automatically set by Vercel Postgres
# NEXTAUTH_URL will be automatically set by Vercel
NEXTAUTH_SECRET="your-production-secret-key-here"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="secure-password-here"
`;
  fs.writeFileSync(vercelEnvPath, envContent);
  console.log('✅ Created .env.production file');
}

console.log('\n📋 Next steps for Vercel Postgres setup:');
console.log('1. Go to your Vercel dashboard');
console.log('2. Navigate to your project settings');
console.log('3. Go to "Storage" tab');
console.log('4. Create a new Postgres database');
console.log('5. Vercel will automatically set DATABASE_URL environment variable');
console.log('6. Deploy your project - Prisma will automatically create tables');

console.log('\n🔧 Local development options:');
console.log('- Keep using SQLite for local dev (recommended)');
console.log('- Or set up local PostgreSQL and update .env.local');

console.log('\n✅ Vercel Postgres setup complete!');