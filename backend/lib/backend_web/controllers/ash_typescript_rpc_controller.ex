defmodule BackendWeb.AshTypescriptRpcController do
  use BackendWeb, :controller

  def run(conn, params) do
    # The actor is already set in conn.assigns by load_user_from_bearer
    # AshTypescript.Rpc.Pipeline uses Ash.PlugHelpers which reads from conn.assigns
    result = AshTypescript.Rpc.run_action(:backend, conn, params)
    json(conn, result)
  end

  def validate(conn, params) do
    result = AshTypescript.Rpc.validate_action(:backend, conn, params)
    json(conn, result)
  end
end
