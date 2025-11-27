defmodule BackendWeb.OnboardingController do
  @moduledoc """
  Controller for customer onboarding via invitation tokens.
  All endpoints are public (no authentication required).
  """

  use BackendWeb, :controller

  alias Backend.Accounts.OnboardingService

  @doc """
  Validate an invitation token.

  GET /api/onboarding/validate/:token

  Returns invitation details if valid, error if invalid/expired.
  """
  def validate_token(conn, %{"token" => token}) do
    case OnboardingService.get_invitation_details(token) do
      {:ok, %{invitation: invitation, company: company}} ->
        conn
        |> put_status(:ok)
        |> json(%{
          valid: true,
          invitation: %{
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            expires_at: invitation.expires_at
          },
          company: company && %{
            id: company.id,
            name: company.name,
            org_number: company.org_number,
            address: company.address,
            city: company.city,
            postal_code: company.postal_code,
            country: company.country,
            phone: company.phone,
            website: company.website
          }
        })

      {:error, :invalid_or_expired_token} ->
        conn
        |> put_status(:not_found)
        |> json(%{valid: false, error: "Invalid or expired invitation token"})

      {:error, reason} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{valid: false, error: inspect(reason)})
    end
  end

  @doc """
  Register a new user via invitation token.

  POST /api/onboarding/register

  Body:
  {
    "token": "invitation-token",
    "user": {
      "email": "user@example.com",
      "password": "securepassword",
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+46701234567"
    },
    "company": {
      "name": "Company AB",
      "org_number": "1234567890",  // Optional for international
      "address": "Street 1",
      "city": "Stockholm",
      "postal_code": "12345",
      "country": "Sweden",
      "phone": "+46812345678",
      "website": "https://example.com",
      "employee_count": "1-10",
      "industry": "IT & Software"
    }
  }
  """
  def register(conn, %{"token" => token, "user" => user_params, "company" => company_params}) do
    case OnboardingService.register_via_invitation(token, user_params, company_params) do
      {:ok, %{user: user, company: company, token: jwt_token}} ->
        conn
        |> put_status(:created)
        |> json(%{
          success: true,
          token: jwt_token,
          user: %{
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            role: user.role,
            company_id: user.company_id
          },
          company: %{
            id: company.id,
            name: company.name,
            org_number: company.org_number,
            industry: company.industry,
            employee_count: company.employee_count
          }
        })

      {:error, :invalid_or_expired_token} ->
        conn
        |> put_status(:not_found)
        |> json(%{success: false, error: "Invalid or expired invitation token"})

      {:error, %Ash.Error.Invalid{} = error} ->
        errors =
          error.errors
          |> Enum.map(fn e ->
            %{
              field: e.field,
              message: Exception.message(e)
            }
          end)

        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, errors: errors})

      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{success: false, error: inspect(reason)})
    end
  end

  def register(conn, _params) do
    conn
    |> put_status(:bad_request)
    |> json(%{success: false, error: "Missing required parameters: token, user, company"})
  end
end
