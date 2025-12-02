defmodule Backend.Accounts do
  use Ash.Domain,
    extensions: [AshJsonApi.Domain, AshTypescript.Rpc]

  typescript_rpc do
    resource Backend.Accounts.User do
      rpc_action :read, :read
      rpc_action :register, :register_with_password
      rpc_action :sign_in, :sign_in_with_password
      rpc_action :change_password, :change_password
      rpc_action :update_profile, :update_profile
    end
  end

  resources do
    resource Backend.Accounts.User
    resource Backend.Accounts.Token
  end
end
