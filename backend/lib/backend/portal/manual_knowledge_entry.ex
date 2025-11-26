defmodule Backend.Portal.ManualKnowledgeEntry do
  @moduledoc """
  Manual knowledge entries added by admin/staff.
  Allows team members to add clarifications, meeting notes, decisions, etc.
  that get embedded and become searchable in the RAG chat.

  Categories:
  - meeting_notes: Notes from customer meetings
  - decision: Important decisions made about the project
  - clarification: Clarifications on requirements
  - feedback: Customer feedback
  - technical: Technical notes and specifications
  - design: Design decisions and preferences
  - other: Miscellaneous entries
  """
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "ManualKnowledgeEntry"
  end

  postgres do
    table "manual_knowledge_entries"
    repo Backend.Repo
  end

  policies do
    # Siteflow staff with AI access can read knowledge entries
    policy action_type(:read) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      authorize_if expr(
        ^actor(:role) in [:siteflow_kam, :siteflow_pl, :siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack] and
        ^actor(:can_use_ai_chat) == true
      )
    end

    # Staff with AI access can create knowledge entries
    policy action_type(:create) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      authorize_if expr(
        ^actor(:role) in [:siteflow_kam, :siteflow_pl, :siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack] and
        ^actor(:can_use_ai_chat) == true
      )
    end

    # Only creator or admin can update/delete
    policy action_type(:update) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      authorize_if expr(created_by_id == ^actor(:id))
    end

    policy action_type(:destroy) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      authorize_if expr(created_by_id == ^actor(:id))
    end
  end

  actions do
    defaults [:read, :destroy]

    create :create do
      accept [:project_id, :title, :content, :raw_input, :category, :metadata]
      change set_attribute(:created_by_id, actor(:id))
    end

    update :update do
      accept [:title, :content, :category, :metadata]
    end

    read :by_project do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
      prepare build(sort: [inserted_at: :desc])
    end

    read :by_category do
      argument :project_id, :uuid, allow_nil?: false
      argument :category, :string, allow_nil?: false
      filter expr(project_id == ^arg(:project_id) and category == ^arg(:category))
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :title, :string do
      allow_nil? false
      public? true
    end

    attribute :content, :string do
      allow_nil? false
      public? true
      description "Structured content (possibly AI-processed)"
    end

    attribute :raw_input, :string do
      allow_nil? true
      public? true
      description "Original input before AI structuring (if applicable)"
    end

    attribute :category, :atom do
      allow_nil? false
      default :other
      public? true
      constraints one_of: [:meeting_notes, :decision, :clarification, :feedback, :technical, :design, :other]
    end

    attribute :metadata, :map do
      default %{}
      public? true
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :project, Backend.Portal.Project do
      allow_nil? false
      public? true
    end

    belongs_to :created_by, Backend.Accounts.User do
      allow_nil? false
      public? true
    end
  end
end
