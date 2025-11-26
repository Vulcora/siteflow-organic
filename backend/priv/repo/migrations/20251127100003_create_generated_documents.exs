defmodule Backend.Repo.Migrations.CreateGeneratedDocuments do
  @moduledoc """
  Creates the generated_documents table for AI-generated project documents.
  These are created automatically when a customer completes the project form.
  """
  use Ecto.Migration

  def change do
    create table(:generated_documents, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :project_id, references(:projects, type: :uuid, on_delete: :delete_all), null: false

      # Document metadata
      add :document_type, :string, null: false  # 'project_spec', 'technical_requirements', 'design_brief', 'budget_timeline'
      add :title, :string, null: false
      add :content, :text, null: false  # Full content (Markdown)
      add :version, :integer, null: false, default: 1

      # Generation info
      add :generated_by_id, references(:users, type: :uuid, on_delete: :nilify_all)
      add :generation_metadata, :map, default: %{}  # Model info, tokens used, etc.

      # Status
      add :status, :string, null: false, default: "draft"  # 'draft', 'published', 'archived'

      timestamps()
    end

    # Index for project lookups
    create index(:generated_documents, [:project_id])

    # Unique index for document type per project (only one of each type)
    create unique_index(:generated_documents, [:project_id, :document_type])

    # Index for status filtering
    create index(:generated_documents, [:status])
  end
end
