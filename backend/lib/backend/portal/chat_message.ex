defmodule Backend.Portal.ChatMessage do
  @moduledoc """
  RAG chat conversation history.
  Stores both user messages and AI assistant responses with source citations.
  Messages are immutable once created.
  """
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "ChatMessage"
  end

  postgres do
    table "chat_messages"
    repo Backend.Repo
  end

  policies do
    # Users can read their own chat messages
    policy action_type(:read) do
      authorize_if expr(user_id == ^actor(:id))
      # Admins can read all chat messages
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end

    # Only users with AI access can create messages
    policy action_type(:create) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      authorize_if expr(
        ^actor(:role) in [:siteflow_kam, :siteflow_pl, :siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack] and
        ^actor(:can_use_ai_chat) == true
      )
    end

    # Only admins can delete messages (for cleanup)
    policy action_type(:destroy) do
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end
  end

  actions do
    defaults [:read, :destroy]

    create :create do
      accept [:project_id, :user_id, :role, :content, :sources, :metadata]
    end

    read :by_project do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
      prepare build(sort: [inserted_at: :asc])
    end

    read :by_user do
      argument :user_id, :uuid, allow_nil?: false
      filter expr(user_id == ^arg(:user_id))
      prepare build(sort: [inserted_at: :desc])
    end

    read :project_history do
      argument :project_id, :uuid, allow_nil?: false
      argument :limit, :integer, default: 50
      filter expr(project_id == ^arg(:project_id))
      prepare build(sort: [inserted_at: :desc], limit: arg(:limit))
    end

    destroy :clear_project_history do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :role, :atom do
      allow_nil? false
      public? true
      constraints one_of: [:user, :assistant]
      description "Message sender role"
    end

    attribute :content, :string do
      allow_nil? false
      public? true
      description "Message content"
    end

    attribute :sources, {:array, :map} do
      default []
      public? true
      description "Source citations for assistant messages: [{embedding_id, content_preview, relevance_score}]"
    end

    attribute :metadata, :map do
      default %{}
      public? true
      description "Tokens used, model, latency, etc."
    end

    create_timestamp :inserted_at
  end

  relationships do
    belongs_to :project, Backend.Portal.Project do
      allow_nil? false
      public? true
    end

    belongs_to :user, Backend.Accounts.User do
      allow_nil? false
      public? true
    end
  end
end
