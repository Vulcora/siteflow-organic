defmodule Backend.Repo.Migrations.CreateEmbeddings do
  @moduledoc """
  Creates the embeddings table for storing vector embeddings used by the RAG system.
  Uses pgvector with 768-dimensional vectors (Gemini text-embedding-004).
  """
  use Ecto.Migration

  def up do
    create table(:embeddings, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :project_id, references(:projects, type: :uuid, on_delete: :delete_all), null: false

      # Source tracking
      add :source_type, :string, null: false  # 'form_response', 'document', 'generated_doc', 'manual_entry', 'image', 'company_info'
      add :source_id, :uuid  # Reference to source record (nullable for some types)

      # Content
      add :content, :text, null: false  # Original text content
      add :content_hash, :string, null: false  # SHA256 for deduplication

      # Vector embedding (768 dimensions for Gemini text-embedding-004)
      # Uses float[] array - works with or without pgvector
      add :embedding, {:array, :float}

      # Metadata
      add :metadata, :map, default: %{}  # Source metadata (section, question_key, etc.)

      timestamps()
    end

    # Index for project lookups
    create index(:embeddings, [:project_id])

    # Index for source lookups
    create index(:embeddings, [:source_type, :source_id])

    # Content hash index for deduplication
    create unique_index(:embeddings, [:project_id, :content_hash])

    # Try to create HNSW index if pgvector is available
    # Check if vector extension is loaded
    result = repo().query!("SELECT COUNT(*) FROM pg_extension WHERE extname = 'vector'")
    [[count]] = result.rows

    if count > 0 do
      # Convert column to vector type for HNSW index
      execute "ALTER TABLE embeddings ALTER COLUMN embedding TYPE vector(768) USING embedding::vector(768)"

      # HNSW index for fast similarity search
      execute """
      CREATE INDEX embeddings_embedding_idx ON embeddings
      USING hnsw (embedding vector_cosine_ops)
      WITH (m = 16, ef_construction = 64)
      """
      IO.puts "\n✅ Created HNSW vector index for fast similarity search."
    else
      # Create a basic GIN index on the array for partial matching
      execute "CREATE INDEX embeddings_embedding_gin_idx ON embeddings USING gin (embedding)"
      IO.puts "\n⚠️  Created GIN index (pgvector not available). Vector search will be slower."
    end
  end

  def down do
    drop table(:embeddings)
  end
end
