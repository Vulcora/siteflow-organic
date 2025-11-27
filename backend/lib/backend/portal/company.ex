defmodule Backend.Portal.Company do
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource, AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "Company"
  end

  postgres do
    table "companies"
    repo Backend.Repo
  end

  json_api do
    type "company"
  end

  policies do
    policy action_type(:read) do
      # Siteflow staff can read all companies
      authorize_if expr(^actor(:role) in [:siteflow_admin, :siteflow_kam, :siteflow_pl,
                                           :siteflow_dev_frontend, :siteflow_dev_backend,
                                           :siteflow_dev_fullstack])
      # Users can read their own company
      authorize_if expr(id == ^actor(:company_id))
    end

    policy action_type(:create) do
      # Only admins can create new companies
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end

    policy action_type(:update) do
      # Only admins can update companies
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end
  end

  actions do
    defaults [:read]

    create :create do
      accept [:name, :org_number, :address, :city, :postal_code, :country, :phone, :website,
              :employee_count, :industry, :logo_url, :billing_address, :billing_city,
              :billing_postal_code, :billing_country]
    end

    create :create_for_onboarding do
      description "Create a company during the invitation onboarding flow"
      accept [:name, :org_number, :address, :city, :postal_code, :country, :phone, :website,
              :employee_count, :industry, :logo_url, :billing_address, :billing_city,
              :billing_postal_code, :billing_country]
    end

    update :update do
      require_atomic? false
      accept [:name, :org_number, :address, :city, :postal_code, :country, :phone, :website,
              :employee_count, :industry, :logo_url, :billing_address, :billing_city,
              :billing_postal_code, :billing_country]
    end

    update :update_logo do
      require_atomic? false
      accept [:logo_url]
    end

    read :by_org_number do
      get? true
      argument :org_number, :string, allow_nil?: false
      filter expr(org_number == ^arg(:org_number))
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :name, :string do
      allow_nil? false
      public? true
    end

    attribute :org_number, :string do
      allow_nil? true
      public? true
      description "Organization number (10 digits for Swedish companies, optional for international)"
    end

    attribute :address, :string do
      public? true
    end

    attribute :city, :string do
      public? true
    end

    attribute :postal_code, :string do
      public? true
    end

    attribute :country, :string do
      default "Sweden"
      public? true
    end

    attribute :phone, :string do
      public? true
    end

    attribute :website, :string do
      public? true
    end

    attribute :is_active, :boolean do
      default true
      public? true
    end

    # Extended onboarding fields
    attribute :employee_count, :string do
      public? true
      description "Number of employees: 1-10, 11-50, 51-200, 201+"
    end

    attribute :industry, :string do
      public? true
      description "Company industry/sector"
    end

    attribute :logo_url, :string do
      public? true
      description "URL to company logo"
    end

    attribute :billing_address, :string do
      public? true
    end

    attribute :billing_city, :string do
      public? true
    end

    attribute :billing_postal_code, :string do
      public? true
    end

    attribute :billing_country, :string do
      public? true
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    has_many :users, Backend.Accounts.User
    has_many :projects, Backend.Portal.Project
    has_many :invitations, Backend.Portal.Invitation
  end

  identities do
    # Unique constraint only applies when org_number is not null
    # The migration creates a partial unique index for this
    identity :unique_org_number, [:org_number], nils_distinct?: true
  end

  validations do
    # Validate org_number format when provided
    validate {Backend.Portal.Company.OrgNumberValidation, []}
  end
end

defmodule Backend.Portal.Company.OrgNumberValidation do
  @moduledoc false
  use Ash.Resource.Validation

  @impl true
  def validate(changeset, _opts, _context) do
    case Ash.Changeset.get_attribute(changeset, :org_number) do
      nil -> :ok
      "" -> :ok
      org_number when is_binary(org_number) ->
        if Regex.match?(~r/^\d{10}$/, org_number) do
          :ok
        else
          {:error, field: :org_number, message: "must be exactly 10 digits"}
        end
      _ -> :ok
    end
  end
end
