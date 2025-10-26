const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Initializing production database...');

try {
  // Ensure database directory exists for SQLite
  const dbPath = process.env.DATABASE_URL || 'file:./prod.db';
  if (dbPath.startsWith('file:')) {
    const dbFile = dbPath.replace('file:', '');
    const dbDir = path.dirname(dbFile);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log('📁 Created database directory:', dbDir);
    }
  }

  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema (creates tables if they don't exist)
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push --force-reset', { stdio: 'inherit' });

  // Run seed script to create initial data
  console.log('🌱 Running database seed...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });

  console.log('✅ Production database initialization completed successfully!');
} catch (error) {
  console.error('❌ Production database initialization failed:', error.message);
  
  // Try alternative approach - just generate client and push schema
  try {
    console.log('🔄 Trying alternative initialization...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Basic database setup completed!');
  } catch (fallbackError) {
    console.error('❌ Fallback initialization also failed:', fallbackError.message);
    process.exit(1);
  }
}