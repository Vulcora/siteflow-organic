defmodule Backend.Portal.FormResponse do
  @moduledoc """
  Stores responses to dynamic project questionnaires (website/system forms).
  Each form response is associated with a project and stores answers as JSON.
  """

  use Ash.Resource,
    otp_app: :backend,
    domain: Backend.Portal,
    data_layer: AshPostgres.DataLayer,
    extensions: [AshJsonApi.Resource, AshTypescript.Resource],
    authorizers: [Ash.Policy.Authorizer]

  typescript do
    type_name "FormResponse"
  end

  postgres do
    table "form_responses"
    repo Backend.Repo
  end

  json_api do
    type "form_response"
  end

  policies do
    policy action_type(:read) do
      # Siteflow staff can read all form responses
      authorize_if expr(^actor(:role) in [:siteflow_admin, :siteflow_kam, :siteflow_pl,
                                           :siteflow_dev_frontend, :siteflow_dev_backend,
                                           :siteflow_dev_fullstack])
      # Users can read their own company's form responses
      authorize_if expr(project.company_id == ^actor(:company_id))
    end

    policy action_type(:create) do
      # Customers can create form responses for their projects
      authorize_if expr(^actor(:role) == :customer)
      # Admins can also create form responses
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end

    policy action_type(:update) do
      # Only allow updates if the project is still in draft state
      authorize_if expr(project.state == :draft)
      # Users can update their own company's form responses
      authorize_if expr(project.company_id == ^actor(:company_id))
      # Admins can update any form response
      authorize_if actor_attribute_equals(:role, :siteflow_admin)
    end
  end

  actions do
    defaults [:read]

    create :create do
      accept [:project_id, :form_type, :section, :question_key, :answer_value, :answer_metadata]
    end

    update :update do
      accept [:answer_value, :answer_metadata]
    end

    destroy :destroy do
      # Allow deletion if project is still in draft
    end

    read :by_project do
      argument :project_id, :uuid, allow_nil?: false
      filter expr(project_id == ^arg(:project_id))
    end

    read :by_project_and_type do
      argument :project_id, :uuid, allow_nil?: false
      argument :form_type, :atom, allow_nil?: false
      filter expr(project_id == ^arg(:project_id) and form_type == ^arg(:form_type))
    end

    read :by_section do
      argument :project_id, :uuid, allow_nil?: false
      argument :section, :string, allow_nil?: false
      filter expr(project_id == ^arg(:project_id) and section == ^arg(:section))
    end
  end

  attributes do
    uuid_primary_key :id

    attribute :form_type, :atom do
      allow_nil? false
      public? true
      description "Type of form: website, system, or both"
      constraints one_of: [:website, :system, :both]
    end

    attribute :section, :string do
      allow_nil? false
      public? true
      description "Section name (e.g., 'basic_info', 'design', 'features')"
    end

    attribute :question_key, :string do
      allow_nil? false
      public? true
      description "Unique key for the question (e.g., 'existing_website', 'budget_range')"
    end

    attribute :answer_value, :map do
      allow_nil? false
      public? true
      description "The actual answer value (can be string, array, object, etc.)"
    end

    attribute :answer_metadata, :map do
      public? true
      description "Additional metadata about the answer (e.g., uploaded file info, timestamps)"
    end

    timestamps()
  end

  relationships do
    belongs_to :project, Backend.Portal.Project do
      allow_nil? false
      attribute_writable? true
    end
  end

  identities do
    identity :unique_question_per_project, [:project_id, :form_type, :question_key]
  end
end
