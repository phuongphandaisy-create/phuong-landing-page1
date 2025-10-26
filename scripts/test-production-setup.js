const { execSync } = require('child_process');
const fs = require('fs');

console.log('🧪 Testing production setup...');

try {
  // Test 1: Check if environment file exists
  console.log('1. Checking environment configuration...');
  if (fs.existsSync('.env.production')) {
    console.log('✅ .env.production exists');
  } else {
    console.log('❌ .env.production missing');
  }

  // Test 2: Generate Prisma client
  console.log('2. Testing Prisma client generation...');
  execSync('npx prisma generate', { stdio: 'pipe' });
  console.log('✅ Prisma client generated successfully');

  // Test 3: Test database push
  console.log('3. Testing database schema push...');
  execSync('npx prisma db push', { stdio: 'pipe' });
  console.log('✅ Database schema pushed successfully');

  // Test 4: Test seed script
  console.log('4. Testing database seed...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'pipe' });
  console.log('✅ Database seeded successfully');

  // Test 5: Test build process
  console.log('5. Testing Next.js build...');
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Next.js build completed successfully');

  console.log('\n🎉 All tests passed! Ready for production deployment.');
  console.log('\n📋 Next steps:');
  console.log('1. Push changes to your repository');
  console.log('2. Update environment variables on Vercel');
  console.log('3. Deploy and test the live site');

} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('- Check if all dependencies are installed: npm install');
  console.log('- Verify .env.production configuration');
  console.log('- Check Prisma schema syntax');
  process.exit(1);
}