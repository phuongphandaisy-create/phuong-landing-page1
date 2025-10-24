# Demo script để test E2E testing setup
Write-Host "🎯 DEMO E2E TESTING SETUP" -ForegroundColor Magenta
Write-Host "=========================" -ForegroundColor Magenta

Write-Host "`n📋 Kiểm tra setup..." -ForegroundColor Yellow

# Kiểm tra Node.js
if (Get-Command "node" -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js không được tìm thấy" -ForegroundColor Red
    exit 1
}

# Kiểm tra npm
if (Get-Command "npm" -ErrorAction SilentlyContinue) {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ npm không được tìm thấy" -ForegroundColor Red
    exit 1
}

# Kiểm tra Playwright
if (Test-Path "node_modules/@playwright/test") {
    Write-Host "✅ Playwright đã được cài đặt" -ForegroundColor Green
} else {
    Write-Host "⚠️  Playwright chưa được cài đặt, đang cài đặt..." -ForegroundColor Yellow
    npm install @playwright/test playwright
    npx playwright install
}

# Kiểm tra các file test
$testFiles = @(
    "e2e/auth/authentication.spec.ts",
    "e2e/blog/blog-crud.spec.ts", 
    "e2e/contact/contact-form.spec.ts",
    "e2e/workflows/complete-auth-flow.spec.ts",
    "e2e/workflows/blog-management.spec.ts"
)

Write-Host "`n📁 Kiểm tra test files..." -ForegroundColor Yellow
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
    }
}

# Kiểm tra scripts
$scriptFiles = @(
    "scripts/test-dev.ps1",
    "scripts/test-prod.ps1",
    "scripts/test-runner.ps1"
)

Write-Host "`n🔧 Kiểm tra script files..." -ForegroundColor Yellow
foreach ($script in $scriptFiles) {
    if (Test-Path $script) {
        Write-Host "✅ $script" -ForegroundColor Green
    } else {
        Write-Host "❌ $script" -ForegroundColor Red
    }
}

# Kiểm tra config
if (Test-Path "playwright.config.ts") {
    Write-Host "✅ playwright.config.ts" -ForegroundColor Green
} else {
    Write-Host "❌ playwright.config.ts" -ForegroundColor Red
}

Write-Host "`n🎮 DEMO COMMANDS:" -ForegroundColor Cyan
Write-Host "=================" -ForegroundColor Cyan

Write-Host "`n1. Chạy demo authentication test:" -ForegroundColor White
Write-Host "   npm run e2e:dev:auth" -ForegroundColor Gray

Write-Host "`n2. Chạy tất cả dev tests:" -ForegroundColor White  
Write-Host "   npm run e2e:dev" -ForegroundColor Gray

Write-Host "`n3. Chạy với test runner:" -ForegroundColor White
Write-Host "   .\scripts\test-runner.ps1 -Environment dev -TestSuite auth -Headed" -ForegroundColor Gray

Write-Host "`n4. Test production (cần URL):" -ForegroundColor White
Write-Host "   .\scripts\test-runner.ps1 -Environment prod -ProductionUrl 'https://your-site.com' -TestSuite readonly -Headed" -ForegroundColor Gray

Write-Host "`n📖 Đọc hướng dẫn chi tiết:" -ForegroundColor White
Write-Host "   Get-Content E2E-TESTING.md" -ForegroundColor Gray

Write-Host "`n🚀 Bạn có muốn chạy demo test ngay không?" -ForegroundColor Yellow
$runDemo = Read-Host "Nhập 'y' để chạy demo authentication test"

if ($runDemo -eq "y" -or $runDemo -eq "Y") {
    Write-Host "`n🎬 Đang chạy demo test..." -ForegroundColor Green
    
    # Kiểm tra dev server
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 3 -UseBasicParsing
        Write-Host "✅ Dev server đang chạy" -ForegroundColor Green
        
        # Chạy demo test
        npx playwright test e2e/auth/authentication.spec.ts --headed --timeout=60000
        
    } catch {
        Write-Host "⚠️  Dev server chưa chạy. Vui lòng chạy 'npm run dev' trước" -ForegroundColor Yellow
        Write-Host "Sau đó chạy: npm run e2e:dev:auth" -ForegroundColor Gray
    }
} else {
    Write-Host "`n✨ Setup hoàn tất! Sẵn sàng để test." -ForegroundColor Green
}

Write-Host "`n📝 Logs và reports sẽ được lưu trong:" -ForegroundColor Cyan
Write-Host "   - logs/ (execution logs)" -ForegroundColor Gray  
Write-Host "   - playwright-report/ (HTML reports)" -ForegroundColor Gray
Write-Host "   - reports/ (JSON summaries)" -ForegroundColor Gray

Write-Host "`n🎉 Happy Testing!" -ForegroundColor Magenta