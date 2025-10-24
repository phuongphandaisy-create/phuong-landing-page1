# PowerShell script to run different types of tests
param(
    [string]$TestType = "all",
    [switch]$Watch = $false,
    [switch]$Coverage = $false,
    [switch]$Verbose = $false
)

Write-Host "🧪 Running Tests for AI Landing Page Project" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

function Run-UnitTests {
    Write-Host "🔬 Running Unit Tests..." -ForegroundColor Yellow
    
    if ($Watch) {
        Write-Host "👀 Running in watch mode..." -ForegroundColor Green
        npm run test:watch
    } elseif ($Coverage) {
        Write-Host "📊 Running with coverage..." -ForegroundColor Green
        npm run test:coverage
    } else {
        npm test
    }
}

function Run-IntegrationTests {
    Write-Host "🔗 Running Integration Tests..." -ForegroundColor Yellow
    npx jest tests/integration --verbose
}

function Run-E2ETests {
    Write-Host "🌐 Running E2E Tests..." -ForegroundColor Yellow
    Write-Host "⚠️  Make sure your dev server is running (npm run dev)" -ForegroundColor Red
    
    $response = Read-Host "Is your dev server running? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        npm run e2e
    } else {
        Write-Host "❌ Please start your dev server first with 'npm run dev'" -ForegroundColor Red
        exit 1
    }
}

function Run-AllTests {
    Write-Host "🚀 Running All Tests..." -ForegroundColor Yellow
    
    # Run unit tests first
    Write-Host "`n1️⃣ Unit Tests" -ForegroundColor Magenta
    npm test
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Unit tests failed!" -ForegroundColor Red
        exit 1
    }
    
    # Run integration tests
    Write-Host "`n2️⃣ Integration Tests" -ForegroundColor Magenta
    npx jest tests/integration --verbose
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Integration tests failed!" -ForegroundColor Red
        exit 1
    }
    
    # Ask about E2E tests
    Write-Host "`n3️⃣ E2E Tests" -ForegroundColor Magenta
    $response = Read-Host "Run E2E tests? (requires dev server) (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        npm run e2e
    } else {
        Write-Host "⏭️  Skipping E2E tests" -ForegroundColor Yellow
    }
}

function Show-TestStructure {
    Write-Host "`n📁 Test Structure:" -ForegroundColor Cyan
    Write-Host "tests/" -ForegroundColor White
    Write-Host "├── unit/" -ForegroundColor White
    Write-Host "│   ├── frontend/" -ForegroundColor White
    Write-Host "│   ├── backend/" -ForegroundColor White
    Write-Host "│   └── shared/" -ForegroundColor White
    Write-Host "├── integration/" -ForegroundColor White
    Write-Host "└── e2e/" -ForegroundColor White
    Write-Host ""
}

# Main execution
switch ($TestType.ToLower()) {
    "unit" { 
        Run-UnitTests 
    }
    "integration" { 
        Run-IntegrationTests 
    }
    "e2e" { 
        Run-E2ETests 
    }
    "all" { 
        Run-AllTests 
    }
    "structure" {
        Show-TestStructure
    }
    default {
        Write-Host "❓ Usage: ./scripts/run-tests.ps1 [unit|integration|e2e|all|structure]" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Options:" -ForegroundColor Cyan
        Write-Host "  -Watch      Run tests in watch mode" -ForegroundColor White
        Write-Host "  -Coverage   Run tests with coverage report" -ForegroundColor White
        Write-Host "  -Verbose    Run tests with verbose output" -ForegroundColor White
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Cyan
        Write-Host "  ./scripts/run-tests.ps1 unit -Watch" -ForegroundColor White
        Write-Host "  ./scripts/run-tests.ps1 all -Coverage" -ForegroundColor White
        Write-Host "  ./scripts/run-tests.ps1 structure" -ForegroundColor White
        Show-TestStructure
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Tests completed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some tests failed!" -ForegroundColor Red
}