# Script chạy test trên môi trường Production
param(
    [Parameter(Mandatory=$true)]
    [string]$ProductionUrl,
    [string]$TestSuite = "all",
    [switch]$Headed = $false,
    [switch]$Debug = $false
)

Write-Host "🚀 Bắt đầu chạy E2E Tests trên môi trường PRODUCTION" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host "🌐 Production URL: $ProductionUrl" -ForegroundColor Cyan

# Set environment variables
$env:NODE_ENV = "production"
$env:BASE_URL = $ProductionUrl

# Tạo thư mục logs nếu chưa có
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
}

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "logs/test-prod-$timestamp.log"

Write-Host "📝 Log file: $logFile" -ForegroundColor Yellow

# Function để log với timestamp
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timeStamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timeStamp] [$Level] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

try {
    Write-Log "Kiểm tra môi trường production..."
    
    # Kiểm tra xem production site có accessible không
    try {
        $response = Invoke-WebRequest -Uri $ProductionUrl -TimeoutSec 10 -UseBasicParsing
        Write-Log "✅ Production site accessible (Status: $($response.StatusCode))"
        
        # Kiểm tra thêm một số thông tin cơ bản
        if ($response.Content -match "<title>(.*?)</title>") {
            Write-Log "📄 Page title: $($matches[1])"
        }
        
    }
    catch {
        Write-Log "❌ Không thể truy cập production site: $($_.Exception.Message)" "ERROR"
        throw "Production site không accessible tại: $ProductionUrl"
    }

    # Cảnh báo về production testing
    Write-Host "`n⚠️  CẢNH BÁO: BẠN ĐANG CHẠY TESTS TRÊN PRODUCTION!" -ForegroundColor Red
    Write-Host "   - Tests có thể tạo dữ liệu thật trên hệ thống production" -ForegroundColor Yellow
    Write-Host "   - Hãy đảm bảo bạn có quyền và hiểu rõ tác động" -ForegroundColor Yellow
    Write-Host "   - Khuyến nghị: Chỉ chạy read-only tests trên production" -ForegroundColor Yellow
    
    $confirm = Read-Host "`nBạn có chắc chắn muốn tiếp tục? (yes/no)"
    if ($confirm -ne "yes") {
        Write-Log "User cancelled production testing" "INFO"
        Write-Host "❌ Đã hủy test production" -ForegroundColor Yellow
        exit 0
    }

    # Xác định test suite để chạy
    $testCommand = "npx playwright test"
    
    # Production testing nên chạy với headed mode để quan sát
    if ($Headed -or $true) {  # Force headed for production
        $testCommand += " --headed"
        Write-Log "🖥️  Chạy test với browser hiển thị (bắt buộc cho production)"
    }
    
    if ($Debug) {
        $testCommand += " --debug"
        Write-Log "🐛 Chạy test ở chế độ debug"
    }

    # Thêm retry cho production
    $testCommand += " --retries=2"
    Write-Log "🔄 Sử dụng 2 lần retry cho production environment"

    switch ($TestSuite.ToLower()) {
        "auth" {
            $testCommand += " e2e/auth/"
            Write-Log "🔐 Chạy Authentication Tests trên production"
        }
        "blog" {
            Write-Log "⚠️  Blog CRUD tests có thể tạo/sửa/xóa dữ liệu thật!" "WARN"
            $blogConfirm = Read-Host "Bạn có chắc muốn chạy Blog CRUD tests? (yes/no)"
            if ($blogConfirm -ne "yes") {
                Write-Log "Skipped Blog CRUD tests" "INFO"
                exit 0
            }
            $testCommand += " e2e/blog/"
            Write-Log "📝 Chạy Blog CRUD Tests trên production"
        }
        "contact" {
            Write-Log "⚠️  Contact form tests sẽ gửi email thật!" "WARN"
            $contactConfirm = Read-Host "Bạn có chắc muốn chạy Contact Form tests? (yes/no)"
            if ($contactConfirm -ne "yes") {
                Write-Log "Skipped Contact Form tests" "INFO"
                exit 0
            }
            $testCommand += " e2e/contact/"
            Write-Log "📧 Chạy Contact Form Tests trên production"
        }
        "workflows" {
            Write-Log "⚠️  Workflow tests có thể thực hiện nhiều thao tác trên production!" "WARN"
            $workflowConfirm = Read-Host "Bạn có chắc muốn chạy Workflow tests? (yes/no)"
            if ($workflowConfirm -ne "yes") {
                Write-Log "Skipped Workflow tests" "INFO"
                exit 0
            }
            $testCommand += " e2e/workflows/"
            Write-Log "🔄 Chạy Workflow Tests trên production"
        }
        "readonly" {
            # Chỉ chạy các tests read-only an toàn cho production
            $testCommand += " e2e/auth/authentication.spec.ts --grep 'Đăng nhập thành công|Đăng nhập thất bại|Kiểm tra validation'"
            Write-Log "👀 Chạy Read-only tests (an toàn cho production)"
        }
        "all" {
            Write-Log "⚠️  Chạy TẤT CẢ tests có thể ảnh hưởng nghiêm trọng đến production!" "WARN"
            $allConfirm = Read-Host "Bạn có THỰC SỰ chắc chắn? (I-AM-SURE/no)"
            if ($allConfirm -ne "I-AM-SURE") {
                Write-Log "Cancelled full test suite on production" "INFO"
                Write-Host "❌ Đã hủy - Hãy cân nhắc chạy 'readonly' thay vì 'all'" -ForegroundColor Yellow
                exit 0
            }
            Write-Log "🎯 Chạy TẤT CẢ tests trên production"
        }
        default {
            $testCommand += " $TestSuite"
            Write-Log "🎯 Chạy test: $TestSuite trên production"
        }
    }

    Write-Log "Executing: $testCommand"
    Write-Log "================================================="
    
    # Chạy tests với timeout cao hơn cho production
    $env:PLAYWRIGHT_TIMEOUT = "60000"  # 60 seconds
    
    Invoke-Expression $testCommand 2>&1 | Tee-Object -FilePath $logFile -Append
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Tất cả production tests đã PASS!" "SUCCESS"
        Write-Host "`n🎉 PRODUCTION TESTS THÀNH CÔNG!" -ForegroundColor Green
    } else {
        Write-Log "❌ Có production tests FAILED!" "ERROR"
        Write-Host "`n💥 CÓ PRODUCTION TESTS THẤT BẠI!" -ForegroundColor Red
        Write-Host "⚠️  Hãy kiểm tra kỹ các lỗi trên production!" -ForegroundColor Yellow
    }

    # Tạo report
    Write-Log "Tạo production test report..."
    if (Test-Path "playwright-report") {
        $reportPath = "playwright-report/index.html"
        Write-Log "📊 Production Test Report: $reportPath"
        Write-Host "📊 Production Report: " -NoNewline
        Write-Host $reportPath -ForegroundColor Cyan
        
        # Rename report để phân biệt với dev
        $prodReportPath = "playwright-report-prod-$timestamp"
        if (Test-Path "playwright-report") {
            Move-Item "playwright-report" $prodReportPath
            Write-Log "📊 Production report saved to: $prodReportPath"
        }
    }

} catch {
    Write-Log "❌ Lỗi khi chạy production tests: $($_.Exception.Message)" "ERROR"
    Write-Host "`n💥 LỖI PRODUCTION TEST: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Write-Log "================================================="
    Write-Log "Production test session kết thúc lúc $(Get-Date)"
    Write-Host "`n📝 Chi tiết log: $logFile" -ForegroundColor Yellow
    
    # Cleanup environment
    Remove-Item Env:PLAYWRIGHT_TIMEOUT -ErrorAction SilentlyContinue
}

# Mở report nếu có
$reportDir = Get-ChildItem -Directory -Name "playwright-report-prod-*" | Sort-Object -Descending | Select-Object -First 1
if ($reportDir -and (Test-Path "$reportDir/index.html")) {
    $openReport = Read-Host "`nBạn có muốn mở Production HTML report không? (y/N)"
    if ($openReport -eq "y" -or $openReport -eq "Y") {
        Start-Process "$reportDir/index.html"
    }
}