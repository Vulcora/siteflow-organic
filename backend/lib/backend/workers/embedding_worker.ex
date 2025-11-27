defmodule Backend.Workers.EmbeddingWorker do
  @moduledoc """
  Oban worker for generating and storing vector embeddings.
  Handles embedding of form responses, generated documents, uploaded files, and manual entries.
  """

  use Oban.Worker,
    queue: :embeddings,
    max_attempts: 3,
    priority: 2

  alias Backend.AI.EmbeddingService
  alias Backend.AI.DocumentGenerator
  alias Backend.AI.RAGService

  require Logger

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "embed_form_responses", "project_id" => project_id}}) do
    Logger.info("Embedding form responses for project #{project_id}")

    case RAGService.embed_form_responses(project_id) do
      {:ok, count} ->
        Logger.info("Embedded #{count} form response sections for project #{project_id}")
        :ok

      {:error, reason} ->
        Logger.error("Failed to embed form responses: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "embed_documents", "project_id" => project_id}}) do
    Logger.info("Embedding generated documents for project #{project_id}")

    case DocumentGenerator.embed_documents(project_id) do
      {:ok, count} ->
        Logger.info("Embedded #{count} documents for project #{project_id}")
        :ok

      {:error, reason} ->
        Logger.error("Failed to embed documents: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "embed_content"} = args}) do
    project_id = Map.fetch!(args, "project_id")
    content = Map.fetch!(args, "content")
    source_type = Map.fetch!(args, "source_type") |> String.to_existing_atom()
    source_id = Map.get(args, "source_id")
    metadata = Map.get(args, "metadata", %{})

    Logger.info("Embedding content (#{source_type}) for project #{project_id}")

    case EmbeddingService.embed_and_store(project_id, content,
           source_type: source_type,
           source_id: source_id,
           metadata: metadata
         ) do
      {:ok, embeddings} ->
        Logger.info("Created #{length(embeddings)} embeddings for project #{project_id}")
        :ok

      {:error, reason} ->
        Logger.error("Failed to embed content: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "embed_all", "project_id" => project_id}}) do
    Logger.info("Embedding all content for project #{project_id}")

    # Embed form responses
    form_result = RAGService.embed_form_responses(project_id)

    # Embed generated documents
    doc_result = DocumentGenerator.embed_documents(project_id)

    # Embed manual knowledge entries
    manual_result = embed_manual_entries(project_id)

    case {form_result, doc_result, manual_result} do
      {{:ok, forms}, {:ok, docs}, {:ok, manual}} ->
        Logger.info(
          "Embedded all content: #{forms} form sections, #{docs} documents, #{manual} manual entries"
        )

        :ok

      _ ->
        Logger.error("Partial embedding failure for project #{project_id}")
        {:error, "Partial embedding failure"}
    end
  end

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "delete_source"} = args}) do
    project_id = Map.fetch!(args, "project_id")
    source_type = Map.fetch!(args, "source_type")
    source_id = Map.fetch!(args, "source_id")

    Logger.info("Deleting embeddings for source #{source_type}:#{source_id}")

    EmbeddingService.delete_by_source(project_id, source_type, source_id)
    :ok
  end

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"action" => "update_source"} = args}) do
    project_id = Map.fetch!(args, "project_id")
    source_type = Map.fetch!(args, "source_type") |> String.to_existing_atom()
    source_id = Map.fetch!(args, "source_id")
    content = Map.fetch!(args, "content")
    metadata = Map.get(args, "metadata", %{})

    Logger.info("Updating embeddings for source #{source_type}:#{source_id}")

    case EmbeddingService.update_embeddings(project_id, source_type, source_id, content,
           metadata: metadata
         ) do
      {:ok, embeddings} ->
        Logger.info("Updated #{length(embeddings)} embeddings")
        :ok

      {:error, reason} ->
        Logger.error("Failed to update embeddings: #{inspect(reason)}")
        {:error, reason}
    end
  end

  # =============================================================================
  # Public API for enqueueing jobs
  # =============================================================================

  @doc """
  Enqueue job to embed all form responses for a project.
  """
  def enqueue_form_responses(project_id) do
    %{args: %{"action" => "embed_form_responses", "project_id" => project_id}}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to embed all generated documents for a project.
  """
  def enqueue_documents(project_id) do
    %{args: %{"action" => "embed_documents", "project_id" => project_id}}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to embed arbitrary content.
  """
  def enqueue_content(project_id, content, source_type, opts \\ []) do
    args = %{
      "action" => "embed_content",
      "project_id" => project_id,
      "content" => content,
      "source_type" => to_string(source_type),
      "source_id" => Keyword.get(opts, :source_id),
      "metadata" => Keyword.get(opts, :metadata, %{})
    }

    %{args: args}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to embed all content for a project (form responses, documents, manual entries).
  """
  def enqueue_all(project_id) do
    %{args: %{"action" => "embed_all", "project_id" => project_id}}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to delete embeddings for a specific source.
  """
  def enqueue_delete(project_id, source_type, source_id) do
    args = %{
      "action" => "delete_source",
      "project_id" => project_id,
      "source_type" => to_string(source_type),
      "source_id" => source_id
    }

    %{args: args}
    |> new()
    |> Oban.insert()
  end

  @doc """
  Enqueue job to update embeddings for a specific source.
  """
  def enqueue_update(project_id, source_type, source_id, content, opts \\ []) do
    args = %{
      "action" => "update_source",
      "project_id" => project_id,
      "source_type" => to_string(source_type),
      "source_id" => source_id,
      "content" => content,
      "metadata" => Keyword.get(opts, :metadata, %{})
    }

    %{args: args}
    |> new()
    |> Oban.insert()
  end

  # =============================================================================
  # Private Functions
  # =============================================================================

  defp embed_manual_entries(project_id) do
    case Backend.Portal.ManualKnowledgeEntry
         |> Ash.Query.for_read(:by_project, %{project_id: project_id})
         |> Ash.read(authorize?: false) do
      {:ok, entries} ->
        results =
          Enum.map(entries, fn entry ->
            content = "# #{entry.title}\nCategory: #{entry.category}\n\n#{entry.content}"

            EmbeddingService.embed_and_store(project_id, content,
              source_type: :manual_entry,
              source_id: entry.id,
              metadata: %{title: entry.title, category: entry.category}
            )
          end)

        successes = Enum.count(results, fn {status, _} -> status == :ok end)
        {:ok, successes}

      {:error, reason} ->
        {:error, reason}
    end
  end
end
