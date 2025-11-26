defmodule Backend.Portal.Embedding do
  @moduledoc """
  Vector embeddings for the RAG AI system.
  Stores text content and its vector representation for semantic search.
  """
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    authorizers: [Ash.Policy.Authorizer]

  postgres do
    table "embeddings"
    repo Backend.Repo
  end

  policies do
    # Only Siteflow staff with AI access can read embeddings
    policy action_type(:read) do
      authorize_if expr(
        actor.role == :siteflow_admin or
        (actor.role in [:siteflow_kam, :siteflow_pl, :siteflow_dev_frontend, :siteflow_dev_backend, :siteflow_dev_fullstack] and
         actor.can_use_ai_chat == true)
      )
    end

    # Only system (via Oban workers) or admins can create/update/delete
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
      accept [:project_id, :source_type, :source_id, :content, :content_hash, :embedding, :metadata]
    end

    update :update do
      accept [:content, :content_hash, :embedding, :metadata]
    end

    read :by_project do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
    end

    read :by_source do
      argument :source_type, :string, allow_nil?: false
      argument :source_id, :uuid, allow_nil?: false
      filter expr(source_type == ^arg(:source_type) and source_id == ^arg(:source_id))
    end

    # Semantic search action (requires raw SQL for vector similarity)
    # This will be called from the RAGService module
    read :search do
      argument :project_id, :uuid, allow_nil?: false
      argument :limit, :integer, default: 10
      filter expr(project_id == ^arg(:project_id))
      prepare build(limit: arg(:limit))
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :source_type, :string do
      allow_nil? false
      public? true
      description "Type of source: form_response, document, generated_doc, manual_entry, image, company_info"
    end

    attribute :source_id, :uuid do
      allow_nil? true
      public? true
      description "Reference to source record (nullable for some types)"
    end

    attribute :content, :string do
      allow_nil? false
      public? true
      description "Original text content"
    end

    attribute :content_hash, :string do
      allow_nil? false
      public? true
      description "SHA256 hash for deduplication"
    end

    # Note: The embedding field is stored as vector(768) in PostgreSQL
    # but Ash/Ecto handles it as a list of floats
    attribute :embedding, {:array, :float} do
      allow_nil? true
      public? false
      description "768-dimensional vector embedding from Gemini"
    end

    attribute :metadata, :map do
      default %{}
      public? true
      description "Source metadata (section, question_key, etc.)"
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :project, Backend.Portal.Project do
      allow_nil? false
      public? true
    end
  end

  identities do
    identity :unique_content_per_project, [:project_id, :content_hash]
  end
end
