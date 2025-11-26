# Test script for RPC endpoints
$baseUrl = "http://localhost:3000"

Write-Host "=== Testing RPC Endpoints ===" -ForegroundColor Cyan

# Step 1: Login and get token
Write-Host "`n1. Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{
    user = @{
        email = "admin@siteflow.se"
        password = "AdminPassword123!"
    }
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/sign-in" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody

    $token = $loginResponse.token
    $userId = $loginResponse.user.id
    $userRole = $loginResponse.user.role

    Write-Host "   Token received: $($token.Substring(0,20))..." -ForegroundColor Green
    Write-Host "   User ID: $userId" -ForegroundColor Green
    Write-Host "   Role: $userRole" -ForegroundColor Green
} catch {
    Write-Host "   Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Test RPC endpoint
Write-Host "`n2. Testing RPC endpoint (company_read)..." -ForegroundColor Yellow
$rpcBody = @{
    action = "company_read"
    fields = @("id", "name", "orgNumber")
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $rpcResponse = Invoke-RestMethod -Uri "$baseUrl/api/rpc/run" `
        -Method Post `
        -Headers $headers `
        -Body $rpcBody

    Write-Host "   Success! Response:" -ForegroundColor Green
    $rpcResponse | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host "   RPC call failed:" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red

    if ($_.ErrorDetails.Message) {
        Write-Host "   Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
