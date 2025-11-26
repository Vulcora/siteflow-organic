$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
$env:ERL_FLAGS = "-sname localhost"
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"

Write-Host "=== Running Migration ===" -ForegroundColor Cyan
mix ecto.migrate

Write-Host "`nDone!" -ForegroundColor Green
