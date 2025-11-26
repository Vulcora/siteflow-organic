defmodule Backend.Portal.Comment do
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource, AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "Comment"
  end

  postgres do
    table "comments"
    repo Backend.Repo
  end

  json_api do
    type "comment"
  end

  policies do
    policy action_type(:read) do
      # Siteflow staff can read all comments (including internal)
      authorize_if expr(^actor(:role) in [:siteflow_admin, :siteflow_kam, :siteflow_pl,
                                           :siteflow_dev_frontend, :siteflow_dev_backend,
                                           :siteflow_dev_fullstack])
      # Customers can read non-internal comments for their company's tickets
      authorize_if expr(ticket.project.company_id == ^actor(:company_id) and is_internal == false)
    end

    policy action_type(:create) do
      # All authenticated users can create comments
      authorize_if always()
    end

    policy action(:update) do
      # Admins can update any comment
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      # Authors can update their own comments
      authorize_if expr(author_id == ^actor(:id))
    end

    policy action(:destroy) do
      # Admins can delete any comment
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
      # Authors can delete their own comments
      authorize_if expr(author_id == ^actor(:id))
    end
  end

  actions do
    defaults [:read]

    create :create do
      accept [:body, :ticket_id, :is_internal]
      change relate_actor(:author)
    end

    update :update do
      accept [:body]
    end

    destroy :destroy do
    end

    read :by_ticket do
      argument :ticket_id, :uuid, allow_nil?: false
      filter expr(ticket_id == ^arg(:ticket_id))
    end

    read :public_comments do
      filter expr(is_internal == false)
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :body, :string do
      allow_nil? false
      public? true
    end

    attribute :is_internal, :boolean do
      default false
      public? true
      description "Internal comments are only visible to staff"
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :ticket, Backend.Portal.Ticket do
      allow_nil? false
      public? true
    end

    belongs_to :author, Backend.Accounts.User do
      allow_nil? false
      public? true
    end
  end
end
