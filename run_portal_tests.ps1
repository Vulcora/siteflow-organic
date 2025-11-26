$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"

Write-Host "=== Running Portal Tests ===" -ForegroundColor Cyan

# Create test database if it doesn't exist
Write-Host "`nSetting up test database..." -ForegroundColor Yellow
$env:MIX_ENV = "test"
mix ecto.create --quiet 2>$null
mix ecto.migrate --quiet

# Run portal tests
Write-Host "`nRunning tests..." -ForegroundColor Yellow
mix test test/backend/portal/ --trace

Write-Host "`n=== Tests Complete ===" -ForegroundColor Green
