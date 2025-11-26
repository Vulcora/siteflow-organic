defmodule Backend.Repo.Migrations.CreateManualKnowledgeEntries do
  @moduledoc """
  Creates the manual_knowledge_entries table for admin/staff added knowledge.
  Allows team members to add clarifications, meeting notes, decisions, etc.
  that get embedded and become searchable in the RAG chat.
  """
  use Ecto.Migration

  def change do
    create table(:manual_knowledge_entries, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :project_id, references(:projects, type: :uuid, on_delete: :delete_all), null: false
      add :created_by_id, references(:users, type: :uuid, on_delete: :nilify_all), null: false

      # Entry content
      add :title, :string, null: false
      add :content, :text, null: false  # Structured content (possibly AI-processed)
      add :raw_input, :text  # Original input before AI structuring (if applicable)

      # Categorization
      add :category, :string, null: false, default: "other"
      # Categories: 'meeting_notes', 'decision', 'clarification', 'feedback', 'technical', 'design', 'other'

      # Metadata
      add :metadata, :map, default: %{}

      timestamps()
    end

    # Index for project lookups
    create index(:manual_knowledge_entries, [:project_id])

    # Index for category filtering
    create index(:manual_knowledge_entries, [:category])

    # Index for author lookups
    create index(:manual_knowledge_entries, [:created_by_id])
  end
end
