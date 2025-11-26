defmodule Backend.Repo.Migrations.EnablePgvector do
  @moduledoc """
  Enables the pgvector extension for storing and querying vector embeddings.
  This is required for the RAG AI system's semantic search capabilities.

  INSTALLATION REQUIRED:
  Before running this migration, you must install pgvector on your PostgreSQL server.

  Windows:
    1. Download from https://github.com/pgvector/pgvector/releases
    2. Copy vector.dll to PostgreSQL's lib folder
    3. Copy vector--*.sql and vector.control to share/extension folder
    Or use pre-built: https://github.com/pgvector/pgvector#windows

  macOS (Homebrew):
    brew install pgvector

  Linux (Ubuntu/Debian):
    sudo apt install postgresql-16-pgvector

  Docker:
    Use ankane/pgvector image
  """
  use Ecto.Migration

  def up do
    # Check if pgvector is available before trying to install
    result = repo().query!("SELECT COUNT(*) FROM pg_available_extensions WHERE name = 'vector'")
    [[count]] = result.rows

    if count > 0 do
      execute "CREATE EXTENSION IF NOT EXISTS vector"
      IO.puts "\n✅ pgvector extension enabled successfully."
    else
      IO.puts """
      \n⚠️  WARNING: pgvector extension not available.
      The RAG system will use float[] arrays for embeddings.
      Vector similarity search will be slower without pgvector.

      To install pgvector:
        Windows: Download from https://github.com/pgvector/pgvector/releases
        macOS: brew install pgvector
        Linux: sudo apt install postgresql-16-pgvector
        Docker: Use ankane/pgvector image

      After installation, run this migration again.
      """
    end
  end

  def down do
    # Only drop if extension exists
    result = repo().query!("SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector'")
    [[count]] = result.rows

    if count > 0 do
      execute "DROP EXTENSION IF EXISTS vector"
    end
  end
end
