defmodule Backend.Accounts.OnboardingService do
  @moduledoc """
  Service for handling customer onboarding via invitation tokens.
  This is the only way for customers to create accounts - they must have a valid invitation.
  """

  alias Backend.Portal.{Company, Invitation}
  alias Backend.Accounts.User

  require Logger

  @doc """
  Validates an invitation token and returns the invitation if valid.
  """
  @spec validate_token(String.t()) :: {:ok, Invitation.t()} | {:error, term()}
  def validate_token(token) do
    case Invitation
         |> Ash.Query.for_read(:by_token, %{token: token})
         |> Ash.read_one(authorize?: false) do
      {:ok, nil} -> {:error, :invalid_or_expired_token}
      {:ok, invitation} -> {:ok, invitation}
      error -> error
    end
  end

  @doc """
  Register a new user via invitation token.
  Creates company (or uses existing), creates user, and accepts the invitation.

  ## Parameters
  - token: The invitation token
  - user_params: %{first_name, last_name, email, password, phone}
  - company_params: %{name, org_number (optional), address, city, postal_code, ...}

  ## Returns
  - {:ok, %{user: user, company: company, token: jwt_token}} on success
  - {:error, reason} on failure
  """
  @spec register_via_invitation(String.t(), map(), map()) ::
          {:ok, %{user: User.t(), company: Company.t(), token: String.t()}} | {:error, term()}
  def register_via_invitation(token, user_params, company_params) do
    # Validate token first
    with {:ok, invitation} <- validate_token(token),
         # Get or create company
         {:ok, company} <- get_or_create_company(invitation.company_id, company_params),
         # Create user
         {:ok, user} <- create_user(user_params, company.id, invitation.role),
         # Accept the invitation
         {:ok, _invitation} <- accept_invitation(invitation, user.id),
         # Generate JWT token for the new user
         {:ok, jwt_token} <- generate_token(user) do

      # Enqueue background job to embed company info into RAG
      schedule_company_embedding(company)

      {:ok, %{user: user, company: company, token: jwt_token}}
    end
  end

  @doc """
  Get invitation details for display during onboarding.
  Returns invitation with preloaded company.
  """
  @spec get_invitation_details(String.t()) ::
          {:ok, %{invitation: Invitation.t(), company: Company.t() | nil}} | {:error, term()}
  def get_invitation_details(token) do
    with {:ok, invitation} <- validate_token(token) do
      # Load the company by ID
      company = Ash.get!(Company, invitation.company_id, authorize?: false)
      {:ok, %{invitation: invitation, company: company}}
    end
  end

  # =============================================================================
  # Private Functions
  # =============================================================================

  defp get_or_create_company(company_id, company_params) do
    # Check if company already exists and has data
    case Ash.get(Company, company_id, authorize?: false) do
      {:ok, company} ->
        # Company exists, update it with provided info
        update_company(company, company_params)

      {:error, %Ash.Error.Query.NotFound{}} ->
        # Company doesn't exist yet, create it with provided params
        create_company(company_params)

      error ->
        error
    end
  end

  defp create_company(params) do
    Company
    |> Ash.Changeset.for_create(:create_for_onboarding, normalize_company_params(params))
    |> Ash.create(authorize?: false)
  end

  defp update_company(company, params) do
    company
    |> Ash.Changeset.for_update(:update, normalize_company_params(params))
    |> Ash.update(authorize?: false)
  end

  defp normalize_company_params(params) do
    params
    |> Map.new(fn {k, v} -> {to_string(k), v} end)
    |> Map.take([
      "name", "org_number", "address", "city", "postal_code", "country",
      "phone", "website", "employee_count", "industry", "logo_url",
      "billing_address", "billing_city", "billing_postal_code", "billing_country"
    ])
    |> Map.new(fn {k, v} -> {String.to_existing_atom(k), v} end)
    |> Map.reject(fn {_k, v} -> is_nil(v) or v == "" end)
  end

  defp create_user(params, company_id, role) do
    normalized_params =
      params
      |> Map.new(fn {k, v} -> {to_string(k), v} end)
      |> Map.take(["email", "password", "first_name", "last_name", "phone"])
      |> Map.new(fn {k, v} -> {String.to_existing_atom(k), v} end)
      |> Map.put(:company_id, company_id)

    User
    |> Ash.Changeset.for_create(:register_with_password, normalized_params)
    |> Ash.Changeset.force_change_attribute(:role, role)
    |> Ash.create(authorize?: false)
  end

  defp accept_invitation(invitation, user_id) do
    invitation
    |> Ash.Changeset.for_update(:accept, %{user_id: user_id})
    |> Ash.update(authorize?: false)
  end

  defp generate_token(user) do
    case AshAuthentication.Jwt.token_for_user(user, %{purpose: "user"}, token_lifetime: 86400) do
      {:ok, token, _claims} -> {:ok, token}
      error -> error
    end
  end

  defp schedule_company_embedding(company) do
    # Company info will be embedded when the first project is created
    # This is because embeddings are tied to projects in the RAG system
    Logger.info("Company #{company.id} registered. RAG embedding will be done when first project is created.")
    :ok
  end
end
