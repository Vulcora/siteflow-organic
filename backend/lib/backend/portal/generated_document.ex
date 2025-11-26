defmodule Backend.Portal.GeneratedDocument do
  @moduledoc """
  AI-generated project documents created from customer form responses.
  These are automatically generated when a customer completes the project questionnaire.

  Document types:
  - project_spec: Overall project specification
  - technical_requirements: Technical requirements and constraints
  - design_brief: Design guidelines and preferences
  - budget_timeline: Budget breakdown and timeline
  """
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "GeneratedDocument"
  end

  postgres do
    table "generated_documents"
    repo Backend.Repo
  end

  policies do
    # Siteflow staff with AI access can read generated documents
    policy action_type(:read) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      authorize_if expr(
        ^actor(:role) in [:siteflow_kam, :siteflow_pl, :siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack] and
        ^actor(:can_use_ai_chat) == true
      )
    end

    # Only admins can create/update/delete (usually done by Oban workers)
    policy action_type(:create) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end

    policy action_type(:update) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end

    policy action_type(:destroy) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end
  end

  actions do
    defaults [:read, :destroy]

    create :create do
      accept [:project_id, :document_type, :title, :content, :generated_by_id, :generation_metadata]
    end

    update :update do
      accept [:title, :content, :status, :generation_metadata]
    end

    update :publish do
      change set_attribute(:status, :published)
    end

    update :archive do
      change set_attribute(:status, :archived)
    end

    update :regenerate do
      accept [:content, :generation_metadata]
      change atomic_update(:version, expr(version + 1))
    end

    read :by_project do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
    end

    read :by_project_and_type do
      argument :project_id, :uuid, allow_nil?: false
      argument :document_type, :string, allow_nil?: false
      get? true
      filter expr(project_id == ^arg(:project_id) and document_type == ^arg(:document_type))
    end

    read :published do
      filter expr(status == :published)
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :document_type, :atom do
      allow_nil? false
      public? true
      constraints one_of: [:project_spec, :technical_requirements, :design_brief, :budget_timeline]
      description "Type of generated document"
    end

    attribute :title, :string do
      allow_nil? false
      public? true
    end

    attribute :content, :string do
      allow_nil? false
      public? true
      description "Full document content in Markdown format"
    end

    attribute :version, :integer do
      allow_nil? false
      default 1
      public? true
      description "Document version number, incremented on regeneration"
    end

    attribute :status, :atom do
      allow_nil? false
      default :draft
      public? true
      constraints one_of: [:draft, :published, :archived]
    end

    attribute :generation_metadata, :map do
      default %{}
      public? true
      description "Model info, tokens used, generation time, etc."
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :project, Backend.Portal.Project do
      allow_nil? false
      public? true
    end

    belongs_to :generated_by, Backend.Accounts.User do
      allow_nil? true
      public? true
      description "User who triggered the generation"
    end
  end

  identities do
    identity :unique_type_per_project, [:project_id, :document_type]
  end
end
