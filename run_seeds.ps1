$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
$env:ERL_FLAGS = "-sname seeds_runner"
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"

Write-Host "=== Running Seeds ===" -ForegroundColor Cyan
mix run priv/repo/seeds.exs

Write-Host "`nDone!" -ForegroundColor Green
