defmodule Backend.Repo.Migrations.CreateChatMessages do
  @moduledoc """
  Creates the chat_messages table for RAG chat conversation history.
  Stores both user messages and AI assistant responses with source citations.
  """
  use Ecto.Migration

  def change do
    create table(:chat_messages, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :project_id, references(:projects, type: :uuid, on_delete: :delete_all), null: false
      add :user_id, references(:users, type: :uuid, on_delete: :delete_all), null: false

      # Message content
      add :role, :string, null: false  # 'user' or 'assistant'
      add :content, :text, null: false

      # Source citations (for assistant messages)
      add :sources, {:array, :map}, default: []  # [{embedding_id, content_preview, relevance_score}]

      # Metadata
      add :metadata, :map, default: %{}  # Tokens used, model, latency, etc.

      # Only inserted_at since messages are immutable
      timestamps(updated_at: false)
    end

    # Index for project conversation history
    create index(:chat_messages, [:project_id, :inserted_at])

    # Index for user's chat history
    create index(:chat_messages, [:user_id, :inserted_at])
  end
end
