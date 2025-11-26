defmodule Backend.Repo.Migrations.CreateObanTables do
  @moduledoc """
  Creates Oban tables for background job processing.
  Used by the RAG system for async embedding generation, document generation, etc.
  """
  use Ecto.Migration

  def up do
    Oban.Migration.up(version: 12)
  end

  def down do
    Oban.Migration.down(version: 1)
  end
end
