#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔄 ${description}...`, colors.cyan);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    log(`✅ ${description} completed successfully`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${description} failed`, colors.red);
    return false;
  }
}

function showHelp() {
  log('\n🧪 Test Runner for AI Landing Page Project', colors.bright);
  log('==========================================', colors.cyan);
  log('\nUsage: node scripts/test-runner.js [command]', colors.yellow);
  log('\nCommands:', colors.bright);
  log('  unit          Run unit tests', colors.reset);
  log('  unit:watch    Run unit tests in watch mode', colors.reset);
  log('  unit:coverage Run unit tests with coverage', colors.reset);
  log('  integration   Run integration tests', colors.reset);
  log('  e2e           Run E2E tests', colors.reset);
  log('  e2e:headed    Run E2E tests with browser visible', colors.reset);
  log('  e2e:debug     Debug E2E tests', colors.reset);
  log('  all           Run all tests', colors.reset);
  log('  check         Check test setup', colors.reset);
  log('  help          Show this help message', colors.reset);
  log('\nExamples:', colors.bright);
  log('  node scripts/test-runner.js unit', colors.yellow);
  log('  node scripts/test-runner.js e2e:headed', colors.yellow);
  log('  node scripts/test-runner.js all', colors.yellow);
}

function checkSetup() {
  log('\n🔍 Checking test setup...', colors.cyan);
  
  const checks = [
    { name: 'Node.js version', command: 'node --version' },
    { name: 'NPM packages', command: 'npm list --depth=0' },
    { name: 'Jest configuration', command: 'npx jest --showConfig' },
    { name: 'Playwright browsers', command: 'npx playwright --version' },
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    try {
      log(`\n📋 ${check.name}:`, colors.yellow);
      execSync(check.command, { stdio: 'inherit' });
    } catch (error) {
      log(`❌ ${check.name} check failed`, colors.red);
      allPassed = false;
    }
  });
  
  if (allPassed) {
    log('\n✅ All setup checks passed!', colors.green);
  } else {
    log('\n❌ Some setup checks failed. Please fix the issues above.', colors.red);
  }
  
  return allPassed;
}

function runAllTests() {
  log('\n🚀 Running all tests...', colors.bright);
  
  const testSuites = [
    { name: 'Unit Tests', command: 'npm test' },
    { name: 'Integration Tests', command: 'npx jest tests/integration --verbose' },
  ];
  
  let allPassed = true;
  
  testSuites.forEach(suite => {
    const success = runCommand(suite.command, suite.name);
    if (!success) allPassed = false;
  });
  
  // Ask about E2E tests
  log('\n🌐 E2E Tests require a running dev server', colors.yellow);
  log('Make sure to run "npm run dev" in another terminal first', colors.yellow);
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl.question('Run E2E tests? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      const e2eSuccess = runCommand('npm run e2e', 'E2E Tests');
      if (!e2eSuccess) allPassed = false;
    }
    
    if (allPassed) {
      log('\n🎉 All tests completed successfully!', colors.green);
    } else {
      log('\n❌ Some tests failed. Check the output above for details.', colors.red);
    }
    
    rl.close();
  });
}

// Main execution
const command = process.argv[2] || 'help';

switch (command) {
  case 'unit':
    runCommand('npm test', 'Unit Tests');
    break;
    
  case 'unit:watch':
    runCommand('npm run test:watch', 'Unit Tests (Watch Mode)');
    break;
    
  case 'unit:coverage':
    runCommand('npm run test:coverage', 'Unit Tests (Coverage)');
    break;
    
  case 'integration':
    runCommand('npx jest tests/integration --verbose', 'Integration Tests');
    break;
    
  case 'e2e':
    log('\n⚠️  Make sure your dev server is running (npm run dev)', colors.yellow);
    runCommand('npm run e2e', 'E2E Tests');
    break;
    
  case 'e2e:headed':
    log('\n⚠️  Make sure your dev server is running (npm run dev)', colors.yellow);
    runCommand('npm run e2e:headed', 'E2E Tests (Headed)');
    break;
    
  case 'e2e:debug':
    log('\n⚠️  Make sure your dev server is running (npm run dev)', colors.yellow);
    runCommand('npm run e2e:debug', 'E2E Tests (Debug)');
    break;
    
  case 'all':
    runAllTests();
    break;
    
  case 'check':
    checkSetup();
    break;
    
  case 'help':
  default:
    showHelp();
    break;
}