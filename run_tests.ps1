$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"

Write-Host "=== Running Backend Tests ===" -ForegroundColor Cyan

# Run specific test files for RAG resources
Write-Host "`nRunning RAG resource tests..." -ForegroundColor Yellow
mix test test/backend/portal/

Write-Host "`n=== Tests Complete ===" -ForegroundColor Green
