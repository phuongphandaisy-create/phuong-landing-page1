# Script chay test tren moi truong Development
param(
    [string]$TestSuite = "all",
    [switch]$Headed = $false,
    [switch]$Debug = $false
)

Write-Host "🚀 Bat dau chay E2E Tests tren moi truong DEVELOPMENT" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "development"
$env:BASE_URL = "http://localhost:3000"

# Tao thu muc logs neu chua co
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "logs/test-dev-$timestamp.log"

Write-Host "📝 Log file: $logFile" -ForegroundColor Yellow

# Function de log voi timestamp
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timeStamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

try {
    Write-Log "Kiem tra moi truong development..."
    
    # Kiem tra xem dev server co dang chay khong
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
        Write-Log "✅ Dev server dang chay (Status: $($response.StatusCode))"
    }
    catch {
        Write-Log "⚠️  Dev server chua chay, dang khoi dong..." "WARN"
        Write-Log "Vui long chay 'npm run dev' trong terminal khac va doi server khoi dong"
        Write-Log "Hoac script se tu dong khoi dong dev server..."
        
        # Tu dong khoi dong dev server (chay trong background)
        Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden
        Write-Log "Dang doi dev server khoi dong..."
        
        # Doi dev server khoi dong (toi da 60 giay)
        $maxWait = 60
        $waited = 0
        do {
            Start-Sleep -Seconds 2
            $waited += 2
            try {
                $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 2 -UseBasicParsing
                Write-Log "✅ Dev server da khoi dong thanh cong!"
                break
            }
            catch {
                Write-Host "." -NoNewline
            }
        } while ($waited -lt $maxWait)
        
        if ($waited -ge $maxWait) {
            throw "Dev server khong the khoi dong trong $maxWait giay"
        }
    }

    # Chuan bi database
    Write-Log "Chuan bi database..."
    npm run db:generate 2>&1 | Tee-Object -FilePath $logFile -Append
    npm run db:migrate 2>&1 | Tee-Object -FilePath $logFile -Append
    npm run db:seed 2>&1 | Tee-Object -FilePath $logFile -Append

    # Xac dinh test suite de chay
    $testCommand = "npx playwright test"
    
    if ($Headed) {
        $testCommand += " --headed"
        Write-Log "🖥️  Chay test voi browser hien thi"
    }
    
    if ($Debug) {
        $testCommand += " --debug"
        Write-Log "🐛 Chay test o che do debug"
    }

    switch ($TestSuite.ToLower()) {
        "auth" {
            $testCommand += " e2e/auth/"
            Write-Log "🔐 Chay Authentication Tests"
        }
        "blog" {
            $testCommand += " e2e/blog/"
            Write-Log "📝 Chay Blog CRUD Tests"
        }
        "contact" {
            $testCommand += " e2e/contact/"
            Write-Log "📧 Chay Contact Form Tests"
        }
        "workflows" {
            $testCommand += " e2e/workflows/"
            Write-Log "🔄 Chay Workflow Tests"
        }
        "all" {
            Write-Log "🎯 Chay tat ca tests"
        }
        default {
            $testCommand += " $TestSuite"
            Write-Log "🎯 Chay test: $TestSuite"
        }
    }

    Write-Log "Executing: $testCommand"
    Write-Log "================================================="
    
    # Chay tests
    Invoke-Expression $testCommand 2>&1 | Tee-Object -FilePath $logFile -Append
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Tat ca tests da PASS!" "SUCCESS"
        Write-Host "`n🎉 TESTS THANH CONG!" -ForegroundColor Green
    } else {
        Write-Log "❌ Co tests FAILED!" "ERROR"
        Write-Host "`n💥 CO TESTS THAT BAI!" -ForegroundColor Red
    }

    # Tao test report
    Write-Log "Tao test report..."
    if (Test-Path "playwright-report") {
        Write-Log "📊 HTML Report: playwright-report/index.html"
        Write-Host "📊 Mo report: " -NoNewline
        Write-Host "playwright-report/index.html" -ForegroundColor Cyan
    }

} catch {
    Write-Log "❌ Loi khi chay tests: $($_.Exception.Message)" "ERROR"
    Write-Host "`n💥 LOI: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Write-Log "================================================="
    Write-Log "Test session ket thuc luc $(Get-Date)"
    Write-Host "`n📝 Chi tiet log: $logFile" -ForegroundColor Yellow
}

# Mo report neu co
if (Test-Path "playwright-report/index.html") {
    $openReport = Read-Host "`nBan co muon mo HTML report khong? (y/N)"
    if ($openReport -eq "y" -or $openReport -eq "Y") {
        Start-Process "playwright-report/index.html"
    }
}