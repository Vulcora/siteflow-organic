defmodule Backend.Repo.Migrations.CreateProductPlans do
  @moduledoc """
  Creates the product_plans table for the Produktplan system.
  Product plans are created by admins and sent to customers for approval.
  """
  use Ecto.Migration

  def change do
    create table(:product_plans, primary_key: false) do
      add :id, :uuid, primary_key: true

      # Relations
      add :project_id, references(:projects, type: :uuid, on_delete: :delete_all), null: false
      add :created_by_id, references(:users, type: :uuid, on_delete: :nilify_all)
      add :approved_by_id, references(:users, type: :uuid, on_delete: :nilify_all)

      # Content
      add :title, :string, null: false
      add :content, :text, null: false  # Markdown content
      add :summary, :text  # Brief summary for display
      add :pdf_url, :string  # URL to uploaded PDF version

      # Version tracking
      add :version, :integer, null: false, default: 1

      # Status workflow
      add :status, :string, null: false, default: "draft"
      # draft -> sent -> viewed -> approved / changes_requested -> revised -> sent ...

      # Timestamps for workflow
      add :sent_at, :utc_datetime_usec
      add :viewed_at, :utc_datetime_usec
      add :approved_at, :utc_datetime_usec
      add :rejected_at, :utc_datetime_usec

      # Customer feedback
      add :customer_feedback, :text
      add :change_requests, :map, default: "{}"

      # Metadata
      add :metadata, :map, default: "{}"

      timestamps(type: :utc_datetime_usec)
    end

    create index(:product_plans, [:project_id])
    create index(:product_plans, [:status])
    create index(:product_plans, [:created_by_id])

    # Only one active (non-archived) plan per project
    create unique_index(:product_plans, [:project_id],
      where: "status != 'archived'",
      name: :product_plans_unique_active_per_project
    )
  end
end
