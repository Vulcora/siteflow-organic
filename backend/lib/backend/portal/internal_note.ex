defmodule Backend.Portal.InternalNote do
  @moduledoc """
  Internal notes that are only visible to Siteflow staff.
  These notes are hidden from customers and partners.
  """
  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource, AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "InternalNote"
  end

  postgres do
    table "internal_notes"
    repo Backend.Repo
  end

  json_api do
    type "internal_note"
  end

  policies do
    # Only Siteflow staff can access internal notes
    policy action_type(:read) do
      authorize_if expr(^actor(:role) in [:siteflow_admin, :siteflow_kam, :siteflow_pl,
                                           :siteflow_dev_frontend, :siteflow_dev_backend,
                                           :siteflow_dev_fullstack])
    end

    policy action_type(:create) do
      authorize_if expr(^actor(:role) in [:siteflow_admin, :siteflow_kam, :siteflow_pl,
                                           :siteflow_dev_frontend, :siteflow_dev_backend,
                                           :siteflow_dev_fullstack])
    end

    policy action_type(:update) do
      # Only the author or admin can update
      authorize_if expr(^actor(:role) == :siteflow_admin)
      authorize_if expr(author_id == ^actor(:id))
    end

    policy action_type(:destroy) do
      # Only the author or admin can delete
      authorize_if expr(^actor(:role) == :siteflow_admin)
      authorize_if expr(author_id == ^actor(:id))
    end
  end

  actions do
    defaults [:read, :destroy]

    create :create do
      accept [:content, :project_id]
      change relate_actor(:author)
    end

    update :update do
      accept [:content]
    end

    read :by_project do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
      prepare build(sort: [inserted_at: :desc])
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :content, :string do
      allow_nil? false
      public? true
      constraints min_length: 1
    end

    create_timestamp :inserted_at
    update_timestamp :updated_at
  end

  relationships do
    belongs_to :project, Backend.Portal.Project do
      allow_nil? false
      public? true
    end

    belongs_to :author, Backend.Accounts.User do
      allow_nil? false
      public? true
    end
  end
end
