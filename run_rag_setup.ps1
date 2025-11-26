$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"

Write-Host "=== RAG System Setup ===" -ForegroundColor Cyan

Write-Host "`n=== Step 1: Fetching dependencies ===" -ForegroundColor Yellow
mix deps.get

Write-Host "`n=== Step 2: Running migrations ===" -ForegroundColor Yellow
mix ecto.migrate

Write-Host "`n=== Step 3: Generating TypeScript types ===" -ForegroundColor Yellow
mix ash_typescript.codegen

Write-Host "`n=== RAG Setup Complete! ===" -ForegroundColor Green
