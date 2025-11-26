$env:PATH = "C:\Program Files\Erlang OTP\bin;C:\Program Files\Elixir\bin;" + $env:PATH
$env:ERL_FLAGS = "-sname check_users"
Set-Location "c:\Users\arouz\Desktop\dev\siteflow-organic\backend"
mix run -e 'Backend.Repo.all(Backend.Accounts.User) |> Enum.each(fn u -> IO.puts("#{u.email} - #{u.role}") end)'
