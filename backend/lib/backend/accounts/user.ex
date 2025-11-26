defmodule Backend.Accounts.User do
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Accounts,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshAuthentication, AshJsonApi.Resource, AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "User"
  end

  postgres do
    table "users"
    repo Backend.Repo
  end

  json_api do
    type "user"
  end

  authentication do
    tokens do
      enabled? true
      token_resource Backend.Accounts.Token
      # Set to false since we use stateless JWT validation (token is self-verifying)
      # When true, tokens must be stored in DB which our sign_in doesn't do
      require_token_presence_for_authentication? false
      signing_secret fn _, _ ->
        Application.fetch_env(:backend, :token_signing_secret)
      end
    end

    # Required when require_token_presence_for_authentication? is false
    # :jti means we use JWT ID for session identification and revocation
    session_identifier :jti

    strategies do
      password :password do
        identity_field :email
        hashed_password_field :hashed_password
        hash_provider Backend.HashProvider
        confirmation_required? false

        register_action_accept [:first_name, :last_name, :company_id]
      end
    end
  end

  policies do
    bypass AshAuthentication.Checks.AshAuthenticationInteraction do
      authorize_if always()
    end

    policy action_type(:read) do
      authorize_if always()
    end
  end

  actions do
    defaults [:read]

    read :get_by_email do
      description "Look up a user by email"
      get? true
      argument :email, :ci_string, allow_nil?: false
      filter expr(email == ^arg(:email))
    end

    update :update_profile do
      accept [:first_name, :last_name, :phone]
    end

    update :assign_role do
      accept [:role]
      argument :role, :atom, allow_nil?: false, constraints: [one_of: [
        :siteflow_admin,
        :siteflow_kam,
        :siteflow_pl,
        :siteflow_dev_frontend,
        :siteflow_dev_backend,
        :siteflow_dev_fullstack,
        :customer,
        :partner
      ]]
      change set_attribute(:role, arg(:role))
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :email, :ci_string do
      allow_nil? false
      public? true
    end

    attribute :hashed_password, :string do
      allow_nil? false
      sensitive? true
    end

    attribute :first_name, :string do
      allow_nil? false
      public? true
    end

    attribute :last_name, :string do
      allow_nil? false
      public? true
    end

    attribute :phone, :string do
      public? true
    end

    attribute :role, :atom do
      constraints one_of: [
        # Siteflow-roller
        :siteflow_admin,
        :siteflow_kam,
        :siteflow_pl,
        :siteflow_dev_frontend,
        :siteflow_dev_backend,
        :siteflow_dev_fullstack,
        # Externa roller
        :customer,
        :partner
      ]
      default :customer
      public? true
    end

    attribute :specialization, :string do
      allow_nil? true
      public? true
      description "Teknisk specialisering (t.ex. 'React, TypeScript' eller 'Elixir, PostgreSQL')"
    end

    attribute :account_manager_id, :uuid do
      allow_nil? true
      public? true
      description "KAM som ansvarar för denna kund"
    end

    attribute :is_active, :boolean do
      default true
      public? true
    end

    attribute :can_use_ai_chat, :boolean do
      default false
      allow_nil? false
      public? true
      description "Allows user to access the RAG AI chat feature"
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :company, Backend.Portal.Company do
      allow_nil? true
      public? true
    end

    belongs_to :account_manager, __MODULE__ do
      source_attribute :account_manager_id
      destination_attribute :id
      allow_nil? true
      public? true
      description "KAM som ansvarar för denna kund"
    end

    has_many :managed_customers, __MODULE__ do
      destination_attribute :account_manager_id
      public? true
      description "Kunder som denna KAM ansvarar för"
    end
  end

  calculations do
    calculate :is_siteflow_staff, :boolean, expr(
      role in [:siteflow_admin, :siteflow_kam, :siteflow_pl,
               :siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack]
    ) do
      public? true
    end

    calculate :is_developer, :boolean, expr(
      role in [:siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack]
    ) do
      public? true
    end

    calculate :can_invite_users, :boolean, expr(
      role in [:siteflow_admin, :siteflow_kam]
    ) do
      public? true
    end

    calculate :has_ai_access, :boolean, expr(
      role == :siteflow_admin or can_use_ai_chat == true
    ) do
      public? true
      description "Admins always have AI access, others need can_use_ai_chat permission"
    end
  end

  identities do
    identity :unique_email, [:email]
  end
end
