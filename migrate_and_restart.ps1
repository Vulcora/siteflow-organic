$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
$env:ERL_FLAGS = "-sname localhost"
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"

Write-Host "=== Stopping existing server ===" -ForegroundColor Cyan
# Kill any running Erlang/Elixir processes
Get-Process | Where-Object {$_.ProcessName -like "*erl*" -or $_.ProcessName -like "*beam*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "`n=== Running migration ===" -ForegroundColor Yellow
mix ecto.migrate

Write-Host "`n=== Generating TypeScript types ===" -ForegroundColor Yellow
mix ash_typescript.codegen

Write-Host "`n=== Starting server ===" -ForegroundColor Cyan
Write-Host "API: http://localhost:4000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

mix phx.server
