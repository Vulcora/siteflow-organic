defmodule Backend.Repo.Migrations.ExtendCompanyForOnboarding do
  @moduledoc """
  Extends the companies table with additional fields for the onboarding flow.
  Makes org_number nullable for international customers.
  """
  use Ecto.Migration

  def change do
    alter table(:companies) do
      # Make org_number nullable for international customers
      modify :org_number, :string, null: true

      # New fields for extended onboarding
      add :employee_count, :string  # "1-10", "11-50", "51-200", "201+"
      add :industry, :string
      add :logo_url, :string
      add :billing_address, :string
      add :billing_city, :string
      add :billing_postal_code, :string
      add :billing_country, :string
    end

    # Drop the unique constraint that requires non-null org_number
    drop_if_exists unique_index(:companies, [:org_number])

    # Create a partial unique index that only applies when org_number is not null
    create unique_index(:companies, [:org_number], where: "org_number IS NOT NULL", name: :companies_org_number_unique_when_not_null)
  end
end
