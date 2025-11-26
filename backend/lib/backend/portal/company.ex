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
      accept [:name, :org_number, :address, :city, :postal_code, :country, :phone, :website]
    end

    update :update do
      accept [:name, :address, :city, :postal_code, :country, :phone, :website]
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
      allow_nil? false
      public? true
      description "Swedish organization number (10 digits)"
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

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    has_many :users, Backend.Accounts.User
    has_many :projects, Backend.Portal.Project
    has_many :invitations, Backend.Portal.Invitation
  end

  identities do
    identity :unique_org_number, [:org_number]
  end

  validations do
    validate match(:org_number, ~r/^\d{10}$/) do
      message "must be exactly 10 digits"
    end
  end
end
