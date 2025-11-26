defmodule Backend.DataCase do
  @moduledoc """
  This module defines the setup for tests requiring
  access to the application's data layer.

  You may define functions here to be used as helpers in
  your tests.

  Finally, if the test case interacts with the database,
  we enable the SQL sandbox, so changes done to the database
  are reverted at the end of every test. If you are using
  PostgreSQL, you can even run database tests asynchronously
  by setting `use Backend.DataCase, async: true`, although
  this option is not recommended for other databases.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias Backend.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import Backend.DataCase
    end
  end

  setup tags do
    Backend.DataCase.setup_sandbox(tags)
    :ok
  end

  @doc """
  Sets up the sandbox based on the test tags.
  """
  def setup_sandbox(tags) do
    pid = Ecto.Adapters.SQL.Sandbox.start_owner!(Backend.Repo, shared: not tags[:async])
    on_exit(fn -> Ecto.Adapters.SQL.Sandbox.stop_owner(pid) end)
  end

  @doc """
  A helper that transforms changeset errors into a map of messages.

      assert {:error, changeset} = Accounts.create_user(%{password: "short"})
      assert "password is too short" in errors_on(changeset).password
      assert %{password: ["password is too short"]} = errors_on(changeset)

  """
  def errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end

  # =============================================================================
  # Test Data Helpers for RAG System
  # =============================================================================

  @doc """
  Creates a test admin user with AI chat access.
  """
  def create_admin_user(attrs \\ %{}) do
    defaults = %{
      email: "admin#{System.unique_integer()}@example.com",
      first_name: "Admin",
      last_name: "User",
      password: "password123"
    }

    user =
      Backend.Accounts.User
      |> Ash.Changeset.for_create(:register_with_password, Map.merge(defaults, attrs))
      |> Ash.create!(authorize?: false)

    # Update role to admin (can't be set during registration)
    user
    |> Ash.Changeset.for_update(:assign_role, %{role: :siteflow_admin})
    |> Ash.update!(authorize?: false)
  end

  @doc """
  Creates a test staff user with AI chat access.
  """
  def create_staff_user_with_ai_access(attrs \\ %{}) do
    defaults = %{
      email: "staff#{System.unique_integer()}@example.com",
      first_name: "Staff",
      last_name: "User",
      password: "password123"
    }

    user =
      Backend.Accounts.User
      |> Ash.Changeset.for_create(:register_with_password, Map.merge(defaults, attrs))
      |> Ash.create!(authorize?: false)

    # Update to dev role with AI access
    user
    |> Ash.Changeset.for_update(:assign_role, %{role: :siteflow_dev_fullstack})
    |> Ash.update!(authorize?: false)
    |> Ash.Changeset.for_update(:update, %{can_use_ai_chat: true}, domain: Backend.Accounts)
    |> Ash.update!(authorize?: false)
  end

  @doc """
  Creates a test customer user (no AI chat access).
  """
  def create_customer_user(attrs \\ %{}) do
    defaults = %{
      email: "customer#{System.unique_integer()}@example.com",
      first_name: "Customer",
      last_name: "User",
      password: "password123"
    }

    Backend.Accounts.User
    |> Ash.Changeset.for_create(:register_with_password, Map.merge(defaults, attrs))
    |> Ash.create!(authorize?: false)
  end

  @doc """
  Creates a test company.
  """
  def create_company(attrs \\ %{}) do
    # Generate a valid 10-digit org number
    unique_id = System.unique_integer([:positive])
    org_number = unique_id |> Integer.to_string() |> String.pad_leading(10, "0") |> String.slice(-10, 10)

    defaults = %{
      name: "Test Company #{System.unique_integer()}",
      org_number: org_number,
      city: "Stockholm"
    }

    Backend.Portal.Company
    |> Ash.Changeset.for_create(:create, Map.merge(defaults, attrs))
    |> Ash.create!(authorize?: false)
  end

  @doc """
  Creates a test project for a company.
  """
  def create_project(company, attrs \\ %{}) do
    defaults = %{
      name: "Test Project #{System.unique_integer()}",
      description: "Test project description",
      company_id: company.id
    }

    Backend.Portal.Project
    |> Ash.Changeset.for_create(:create, Map.merge(defaults, attrs))
    |> Ash.create!(authorize?: false)
  end

  @doc """
  Creates a test generated document.
  """
  def create_generated_document(project, actor, attrs \\ %{}) do
    defaults = %{
      project_id: project.id,
      document_type: :project_spec,
      title: "Test Document",
      content: "# Test Document\n\nThis is a test document.",
      generated_by_id: actor.id
    }

    Backend.Portal.GeneratedDocument
    |> Ash.Changeset.for_create(:create, Map.merge(defaults, attrs), actor: actor)
    |> Ash.create!(authorize?: false)
  end

  @doc """
  Creates a test chat message.
  """
  def create_chat_message(project, user, attrs \\ %{}) do
    defaults = %{
      project_id: project.id,
      user_id: user.id,
      role: :user,
      content: "Test message #{System.unique_integer()}"
    }

    Backend.Portal.ChatMessage
    |> Ash.Changeset.for_create(:create, Map.merge(defaults, attrs), actor: user)
    |> Ash.create!(authorize?: false)
  end

  @doc """
  Creates a test manual knowledge entry.
  """
  def create_knowledge_entry(project, actor, attrs \\ %{}) do
    defaults = %{
      project_id: project.id,
      title: "Test Knowledge Entry",
      content: "This is test knowledge content.",
      category: :other
    }

    Backend.Portal.ManualKnowledgeEntry
    |> Ash.Changeset.for_create(:create, Map.merge(defaults, attrs), actor: actor)
    |> Ash.create!(authorize?: false)
  end
end
