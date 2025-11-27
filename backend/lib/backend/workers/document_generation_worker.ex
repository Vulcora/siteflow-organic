defmodule Backend.Workers.DocumentGenerationWorker do
  @moduledoc """
  Oban worker for generating AI documents from form responses.
  Triggered when a customer completes a project questionnaire.
  """

  use Oban.Worker,
    queue: :documents,
    max_attempts: 3,
    priority: 1

  alias Backend.AI.DocumentGenerator

  require Logger

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"project_id" => project_id} = args}) do
    user_id = Map.get(args, "user_id")
    document_types = Map.get(args, "document_types")
    embed_after = Map.get(args, "embed_after", true)

    Logger.info("Starting document generation for project #{project_id}")

    result =
      if document_types do
        # Generate specific document types
        generate_specific_documents(project_id, document_types, user_id)
      else
        # Generate all documents
        DocumentGenerator.generate_all_documents(project_id, user_id)
      end

    case result do
      {:ok, documents} ->
        Logger.info("Generated #{length(documents)} documents for project #{project_id}")

        # Embed documents if requested
        if embed_after do
          embed_generated_documents(project_id)
        end

        :ok

      {:error, :no_form_responses} ->
        Logger.warning("No form responses found for project #{project_id}")
        {:error, "No form responses available for document generation"}

      {:error, {:partial_failure, failures}} ->
        Logger.error("Partial document generation failure: #{inspect(failures)}")
        {:error, "Some documents failed to generate"}

      {:error, reason} ->
        Logger.error("Document generation failed: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "regenerate"} = args}) do
    project_id = Map.fetch!(args, "project_id")
    document_type = Map.fetch!(args, "document_type") |> String.to_existing_atom()
    user_id = Map.get(args, "user_id")

    Logger.info("Regenerating #{document_type} for project #{project_id}")

    case DocumentGenerator.regenerate_document(project_id, document_type, user_id) do
      {:ok, document} ->
        Logger.info("Regenerated document #{document.id} (version #{document.version})")

        # Re-embed the updated document
        embed_generated_documents(project_id)

        :ok

      {:error, reason} ->
        Logger.error("Document regeneration failed: #{inspect(reason)}")
        {:error, reason}
    end
  end

  # =============================================================================
  # Public API for enqueueing jobs
  # =============================================================================

  @doc """
  Enqueue job to generate all documents for a project.
  """
  def enqueue_all(project_id, opts \\ []) do
    args = %{
      "project_id" => project_id,
      "user_id" => Keyword.get(opts, :user_id),
      "embed_after" => Keyword.get(opts, :embed_after, true)
    }

    %{args: args}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to generate specific document types.
  """
  def enqueue_specific(project_id, document_types, opts \\ []) do
    args = %{
      "project_id" => project_id,
      "document_types" => Enum.map(document_types, &to_string/1),
      "user_id" => Keyword.get(opts, :user_id),
      "embed_after" => Keyword.get(opts, :embed_after, true)
    }

    %{args: args}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to regenerate a specific document.
  """
  def enqueue_regenerate(project_id, document_type, opts \\ []) do
    args = %{
      "action" => "regenerate",
      "project_id" => project_id,
      "document_type" => to_string(document_type),
      "user_id" => Keyword.get(opts, :user_id)
    }

    %{args: args}
    |> new()
    |> Oban.insert()
  end

  # =============================================================================
  # Private Functions
  # =============================================================================

  defp generate_specific_documents(project_id, document_types, user_id) do
    case Backend.Portal.FormResponse
         |> Ash.Query.for_read(:by_project, %{project_id: project_id})
         |> Ash.read(authorize?: false) do
      {:ok, responses} when responses != [] ->
        grouped = group_responses(responses)

        results =
          document_types
          |> Enum.map(&String.to_existing_atom/1)
          |> Enum.map(fn doc_type ->
            DocumentGenerator.generate_document(project_id, doc_type, grouped, user_id)
          end)

        {successes, failures} = Enum.split_with(results, fn {status, _} -> status == :ok end)

        if failures == [] do
          {:ok, Enum.map(successes, fn {:ok, doc} -> doc end)}
        else
          {:error, {:partial_failure, failures}}
        end

      {:ok, []} ->
        {:error, :no_form_responses}

      error ->
        error
    end
  end

  defp group_responses(responses) do
    responses
    |> Enum.group_by(& &1.section)
    |> Map.new(fn {section, items} ->
      questions =
        items
        |> Enum.map(fn r -> {r.question_key, r.answer_value} end)
        |> Map.new()

      {section, questions}
    end)
  end

  defp embed_generated_documents(project_id) do
    # Enqueue embedding job
    Backend.Workers.EmbeddingWorker.enqueue_documents(project_id)
  end
end
