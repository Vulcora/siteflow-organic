defmodule Backend.Repo.Migrations.UpdateUsersForRoles do
  @moduledoc """
  Updates users table with new role system and relationships.

  - Adds specialization field for technical skills
  - Adds account_manager_id for KAM-customer relationships
  - Updates role default to :customer
  """

  use Ecto.Migration

  def up do
    alter table(:users) do
      # Add new fields
      add :specialization, :text
      add :account_manager_id, :uuid

      # Update role default
      modify :role, :text, default: "customer"
    end

    # Add foreign key constraint for account_manager relationship
    alter table(:users) do
      modify :account_manager_id,
             references(:users,
               column: :id,
               name: "users_account_manager_id_fkey",
               type: :uuid,
               prefix: "public",
               on_delete: :nilify_all
             )
    end
  end

  def down do
    drop constraint(:users, "users_account_manager_id_fkey")

    alter table(:users) do
      remove :specialization
      remove :account_manager_id
      modify :role, :text, default: "user"
    end
  end
end
