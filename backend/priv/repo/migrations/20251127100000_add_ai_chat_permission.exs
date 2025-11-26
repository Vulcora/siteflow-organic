defmodule Backend.Repo.Migrations.AddAiChatPermission do
  @moduledoc """
  Adds can_use_ai_chat boolean to users table for RAG AI chat access control.
  Admins always have access, but other staff members need this flag enabled.
  """
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :can_use_ai_chat, :boolean, null: false, default: false
    end

    # Create index for querying users with AI access
    create index(:users, [:can_use_ai_chat])
  end
end
