defmodule Backend.Repo.Migrations.AddInternalNotesAndPriority do
  @moduledoc """
  Adds internal notes table and is_priority field to projects.
  These are admin-only features for managing project requests.
  """
  use Ecto.Migration

  def up do
    # Add is_priority to projects
    alter table(:projects) do
      add :is_priority, :boolean, null: false, default: false
    end

    # Create internal_notes table
    create table(:internal_notes, primary_key: false) do
      add :id, :uuid, null: false, primary_key: true
      add :content, :text, null: false
      add :project_id, references(:projects, type: :uuid, on_delete: :delete_all), null: false
      add :author_id, references(:users, type: :uuid, on_delete: :nilify_all), null: false

      timestamps(type: :utc_datetime)
    end

    # Create indexes
    create index(:internal_notes, [:project_id])
    create index(:internal_notes, [:author_id])
    create index(:projects, [:is_priority])
  end

  def down do
    drop index(:projects, [:is_priority])
    drop index(:internal_notes, [:author_id])
    drop index(:internal_notes, [:project_id])
    drop table(:internal_notes)

    alter table(:projects) do
      remove :is_priority
    end
  end
end
