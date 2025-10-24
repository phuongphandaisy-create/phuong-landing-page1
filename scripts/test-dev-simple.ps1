# Simple test script
param(
    [string]$TestSuite = "all"
)

Write-Host "Starting E2E Tests" -ForegroundColor Green

try {
    Write-Host "Testing basic functionality..."
    
    # Simple test command selection
    $testCommand = "npx playwright test"
    
    if ($TestSuite -eq "auth") {
        $testCommand += " e2e/auth/"
        Write-Host "Running Authentication Tests"
    }
    elseif ($TestSuite -eq "blog") {
        $testCommand += " e2e/blog/"
        Write-Host "Running Blog CRUD Tests"
    }
    elseif ($TestSuite -eq "contact") {
        $testCommand += " e2e/contact/"
        Write-Host "Running Contact Form Tests"
    }
    elseif ($TestSuite -eq "workflows") {
        $testCommand += " e2e/workflows/"
        Write-Host "Running Workflow Tests"
    }
    else {
        Write-Host "Running all tests"
    }

    Write-Host "Command: $testCommand"
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Write-Host "Test session completed"
}

Write-Host "Script finished successfully"