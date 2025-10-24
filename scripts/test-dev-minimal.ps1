param([string]$TestSuite = "all")

Write-Host "Starting E2E Tests for $TestSuite" -ForegroundColor Green

$testCommand = "npx playwright test"

if ($TestSuite -eq "auth") { $testCommand += " e2e/auth/" }
if ($TestSuite -eq "blog") { $testCommand += " e2e/blog/" }  
if ($TestSuite -eq "contact") { $testCommand += " e2e/contact/" }
if ($TestSuite -eq "workflows") { $testCommand += " e2e/workflows/" }

Write-Host "Command: $testCommand"
Invoke-Expression $testCommand