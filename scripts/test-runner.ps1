# Main Test Runner Script - Hỗ trợ chạy test trên cả dev và production
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("dev", "prod", "both")]
    [string]$Environment,
    
    [string]$ProductionUrl = "",
    [string]$TestSuite = "all",
    [switch]$Headed = $false,
    [switch]$Debug = $false,
    [switch]$GenerateReport = $true
)

Write-Host "🎯 AI ASSISTED LANDING PAGE - E2E TEST RUNNER" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Magenta

# Function để hiển thị help
function Show-Help {
    Write-Host "`n📖 HƯỚNG DẪN SỬ DỤNG:" -ForegroundColor Cyan
    Write-Host "  .\scripts\test-runner.ps1 -Environment dev -TestSuite all" -ForegroundColor White
    Write-Host "  .\scripts\test-runner.ps1 -Environment prod -ProductionUrl 'https://your-site.com' -TestSuite readonly" -ForegroundColor White
    Write-Host "  .\scripts\test-runner.ps1 -Environment both -ProductionUrl 'https://your-site.com' -TestSuite auth -Headed" -ForegroundColor White
    
    Write-Host "`n📋 THAM SỐ:" -ForegroundColor Cyan
    Write-Host "  -Environment    : dev, prod, both" -ForegroundColor White
    Write-Host "  -ProductionUrl  : URL của production site (bắt buộc khi Environment = prod/both)" -ForegroundColor White
    Write-Host "  -TestSuite      : all, auth, blog, contact, workflows, readonly" -ForegroundColor White
    Write-Host "  -Headed         : Hiển thị browser khi test" -ForegroundColor White
    Write-Host "  -Debug          : Chạy ở chế độ debug" -ForegroundColor White
    Write-Host "  -GenerateReport : Tạo HTML report (mặc định: true)" -ForegroundColor White
    
    Write-Host "`n🎯 TEST SUITES:" -ForegroundColor Cyan
    Write-Host "  all        : Tất cả tests" -ForegroundColor White
    Write-Host "  auth       : Authentication tests" -ForegroundColor White
    Write-Host "  blog       : Blog CRUD tests" -ForegroundColor White
    Write-Host "  contact    : Contact form tests" -ForegroundColor White
    Write-Host "  workflows  : Complete workflow tests" -ForegroundColor White
    Write-Host "  readonly   : Chỉ tests read-only (an toàn cho production)" -ForegroundColor White
}

# Validate parameters
if (($Environment -eq "prod" -or $Environment -eq "both") -and [string]::IsNullOrEmpty($ProductionUrl)) {
    Write-Host "❌ Lỗi: ProductionUrl là bắt buộc khi Environment = prod hoặc both" -ForegroundColor Red
    Show-Help
    exit 1
}

# Tạo thư mục logs và reports
@("logs", "reports") | ForEach-Object {
    if (!(Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ | Out-Null
    }
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$mainLogFile = "logs/test-runner-$timestamp.log"

function Write-MainLog {
    param([string]$Message, [string]$Level = "INFO")
    $timeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timeStamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $mainLogFile -Value $logMessage
}

try {
    Write-MainLog "Bắt đầu test session với Environment: $Environment, TestSuite: $TestSuite"
    
    # Kiểm tra dependencies
    Write-MainLog "Kiểm tra dependencies..."
    
    if (!(Get-Command "npm" -ErrorAction SilentlyContinue)) {
        throw "npm không được tìm thấy. Vui lòng cài đặt Node.js"
    }
    
    if (!(Get-Command "npx" -ErrorAction SilentlyContinue)) {
        throw "npx không được tìm thấy. Vui lòng cài đặt Node.js"
    }
    
    # Kiểm tra Playwright
    if (!(Test-Path "node_modules/@playwright/test")) {
        Write-MainLog "Cài đặt Playwright dependencies..."
        npm install @playwright/test playwright 2>&1 | Tee-Object -FilePath $mainLogFile -Append
    }
    
    Write-MainLog "✅ Dependencies OK"
    
    # Tạo test summary
    $testResults = @{
        Dev = @{ Status = "Not Run"; Duration = 0; Tests = 0; Passed = 0; Failed = 0 }
        Prod = @{ Status = "Not Run"; Duration = 0; Tests = 0; Passed = 0; Failed = 0 }
    }
    
    # Chạy Dev Tests
    if ($Environment -eq "dev" -or $Environment -eq "both") {
        Write-MainLog "🔧 Bắt đầu DEV TESTS..."
        Write-Host "`n" + "="*50 -ForegroundColor Blue
        Write-Host "🔧 DEVELOPMENT ENVIRONMENT TESTS" -ForegroundColor Blue
        Write-Host "="*50 -ForegroundColor Blue
        
        $devStartTime = Get-Date
        
        try {
            $devArgs = @(
                "-TestSuite", $TestSuite
            )
            
            if ($Headed) { $devArgs += "-Headed" }
            if ($Debug) { $devArgs += "-Debug" }
            
            & ".\scripts\test-dev.ps1" @devArgs
            
            if ($LASTEXITCODE -eq 0) {
                $testResults.Dev.Status = "PASSED"
                Write-MainLog "✅ Dev tests PASSED"
            } else {
                $testResults.Dev.Status = "FAILED"
                Write-MainLog "❌ Dev tests FAILED"
            }
            
        } catch {
            $testResults.Dev.Status = "ERROR"
            Write-MainLog "💥 Dev tests ERROR: $($_.Exception.Message)"
        }
        
        $testResults.Dev.Duration = ((Get-Date) - $devStartTime).TotalMinutes
    }
    
    # Chạy Prod Tests
    if ($Environment -eq "prod" -or $Environment -eq "both") {
        Write-MainLog "🌐 Bắt đầu PRODUCTION TESTS..."
        Write-Host "`n" + "="*50 -ForegroundColor Red
        Write-Host "🌐 PRODUCTION ENVIRONMENT TESTS" -ForegroundColor Red
        Write-Host "="*50 -ForegroundColor Red
        
        $prodStartTime = Get-Date
        
        try {
            $prodArgs = @(
                "-ProductionUrl", $ProductionUrl,
                "-TestSuite", $TestSuite
            )
            
            if ($Headed) { $prodArgs += "-Headed" }
            if ($Debug) { $prodArgs += "-Debug" }
            
            & ".\scripts\test-prod.ps1" @prodArgs
            
            if ($LASTEXITCODE -eq 0) {
                $testResults.Prod.Status = "PASSED"
                Write-MainLog "✅ Production tests PASSED"
            } else {
                $testResults.Prod.Status = "FAILED"
                Write-MainLog "❌ Production tests FAILED"
            }
            
        } catch {
            $testResults.Prod.Status = "ERROR"
            Write-MainLog "💥 Production tests ERROR: $($_.Exception.Message)"
        }
        
        $testResults.Prod.Duration = ((Get-Date) - $prodStartTime).TotalMinutes
    }
    
    # Tạo summary report
    Write-Host "`n" + "="*60 -ForegroundColor Green
    Write-Host "📊 TEST EXECUTION SUMMARY" -ForegroundColor Green
    Write-Host "="*60 -ForegroundColor Green
    
    Write-Host "🕐 Thời gian: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
    Write-Host "🎯 Test Suite: $TestSuite" -ForegroundColor White
    Write-Host "🖥️  Headed Mode: $Headed" -ForegroundColor White
    Write-Host "🐛 Debug Mode: $Debug" -ForegroundColor White
    
    if ($Environment -eq "dev" -or $Environment -eq "both") {
        $devColor = switch ($testResults.Dev.Status) {
            "PASSED" { "Green" }
            "FAILED" { "Red" }
            "ERROR" { "Magenta" }
            default { "Yellow" }
        }
        Write-Host "`n🔧 DEV ENVIRONMENT:" -ForegroundColor Blue
        Write-Host "   Status: $($testResults.Dev.Status)" -ForegroundColor $devColor
        Write-Host "   Duration: $([math]::Round($testResults.Dev.Duration, 2)) minutes" -ForegroundColor White
    }
    
    if ($Environment -eq "prod" -or $Environment -eq "both") {
        $prodColor = switch ($testResults.Prod.Status) {
            "PASSED" { "Green" }
            "FAILED" { "Red" }
            "ERROR" { "Magenta" }
            default { "Yellow" }
        }
        Write-Host "`n🌐 PRODUCTION ENVIRONMENT:" -ForegroundColor Red
        Write-Host "   URL: $ProductionUrl" -ForegroundColor White
        Write-Host "   Status: $($testResults.Prod.Status)" -ForegroundColor $prodColor
        Write-Host "   Duration: $([math]::Round($testResults.Prod.Duration, 2)) minutes" -ForegroundColor White
    }
    
    # Overall status
    $overallStatus = "PASSED"
    if ($testResults.Dev.Status -eq "FAILED" -or $testResults.Prod.Status -eq "FAILED") {
        $overallStatus = "FAILED"
    } elseif ($testResults.Dev.Status -eq "ERROR" -or $testResults.Prod.Status -eq "ERROR") {
        $overallStatus = "ERROR"
    }
    
    $overallColor = switch ($overallStatus) {
        "PASSED" { "Green" }
        "FAILED" { "Red" }
        "ERROR" { "Magenta" }
    }
    
    Write-Host "`n🏆 OVERALL STATUS: $overallStatus" -ForegroundColor $overallColor
    
    # Lưu summary vào file
    $summaryFile = "reports/test-summary-$timestamp.json"
    $summary = @{
        Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        Environment = $Environment
        TestSuite = $TestSuite
        ProductionUrl = $ProductionUrl
        Headed = $Headed
        Debug = $Debug
        Results = $testResults
        OverallStatus = $overallStatus
    }
    
    $summary | ConvertTo-Json -Depth 3 | Out-File -FilePath $summaryFile -Encoding UTF8
    Write-MainLog "📄 Summary saved to: $summaryFile"
    
    # Hiển thị các file reports có sẵn
    Write-Host "`n📁 REPORTS & LOGS:" -ForegroundColor Cyan
    Write-Host "   Main Log: $mainLogFile" -ForegroundColor White
    Write-Host "   Summary: $summaryFile" -ForegroundColor White
    
    Get-ChildItem -Path "playwright-report*" -Directory | ForEach-Object {
        Write-Host "   HTML Report: $($_.Name)/index.html" -ForegroundColor White
    }
    
    Get-ChildItem -Path "logs" -Filter "test-*-$timestamp.log" | ForEach-Object {
        Write-Host "   Detailed Log: $($_.FullName)" -ForegroundColor White
    }
    
    Write-Host "="*60 -ForegroundColor Green
    
    # Exit với appropriate code
    if ($overallStatus -eq "PASSED") {
        Write-MainLog "🎉 Test session completed successfully!"
        exit 0
    } else {
        Write-MainLog "💥 Test session completed with issues!"
        exit 1
    }
    
} catch {
    Write-MainLog "💥 Critical error in test runner: $($_.Exception.Message)" "ERROR"
    Write-Host "`n💥 CRITICAL ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Show-Help
    exit 1
} finally {
    Write-MainLog "Test runner session ended at $(Get-Date)"
}