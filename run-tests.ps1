# PowerShell script để chạy tests sau khi cài Node.js

Write-Host "🚀 Checking Node.js installation..." -ForegroundColor Green

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first!" -ForegroundColor Red
    Write-Host "📥 Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📦 Installing dependencies..." -ForegroundColor Blue
try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n🧪 Installing testing dependencies..." -ForegroundColor Blue
try {
    npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom @types/jest
    Write-Host "✅ Testing dependencies installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install testing dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n🧪 Running tests..." -ForegroundColor Blue
try {
    npm run test
    Write-Host "✅ All tests completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Some tests failed" -ForegroundColor Red
}

Write-Host "`n📊 Running tests with coverage..." -ForegroundColor Blue
try {
    npm run test:coverage
    Write-Host "✅ Coverage report generated!" -ForegroundColor Green
} catch {
    Write-Host "❌ Coverage report failed" -ForegroundColor Red
}

Write-Host "`n🎉 Test setup complete!" -ForegroundColor Green
Write-Host "📝 You can now run:" -ForegroundColor Yellow
Write-Host "   npm run test        - Run tests once" -ForegroundColor White
Write-Host "   npm run test:watch  - Run tests in watch mode" -ForegroundColor White
Write-Host "   npm run dev         - Start development server" -ForegroundColor White