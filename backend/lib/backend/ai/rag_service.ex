defmodule Backend.AI.RAGService do
  @moduledoc """
  RAG (Retrieval Augmented Generation) service.
  Handles context retrieval from embeddings and generates responses using AI.
  Supports streaming responses for real-time chat.
  """

  alias Backend.AI.GeminiClient
  alias Backend.AI.EmbeddingService
  alias Backend.Portal.ChatMessage

  require Logger

  # =============================================================================
  # Configuration
  # =============================================================================

  # Maximum context tokens to include (roughly 4 chars per token)
  @max_context_chars 12_000
  # Number of similar chunks to retrieve
  @top_k_chunks 8
  # Minimum similarity score for relevance
  @min_similarity 0.5

  # =============================================================================
  # Public API
  # =============================================================================

  @doc """
  Ask a question about a project with RAG context.
  Retrieves relevant context from the project's knowledge base and generates a response.
  """
  @spec ask(String.t(), String.t(), keyword()) ::
          {:ok, String.t(), map()} | {:error, term()}
  def ask(project_id, question, opts \\ []) do
    user_id = Keyword.get(opts, :user_id)
    include_sources = Keyword.get(opts, :include_sources, true)

    # Build context from relevant embeddings
    case build_context(project_id, question) do
      {:ok, context, sources} ->
        # Build prompt with context
        prompt = build_rag_prompt(question, context)

        # Generate response
        case GeminiClient.generate_text(prompt, max_tokens: 2000) do
          {:ok, response, usage} ->
            # Save the conversation
            save_messages(project_id, user_id, question, response, sources, usage)

            if include_sources do
              {:ok, response, %{sources: sources, usage: usage}}
            else
              {:ok, response, %{usage: usage}}
            end

          {:error, reason} ->
            {:error, reason}
        end

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Stream a response to a question about a project.
  Calls the callback function with each chunk of the response.
  """
  @spec ask_stream(String.t(), String.t(), (String.t() -> any()), keyword()) ::
          {:ok, map()} | {:error, term()}
  def ask_stream(project_id, question, callback, opts \\ []) do
    user_id = Keyword.get(opts, :user_id)

    case build_context(project_id, question) do
      {:ok, context, sources} ->
        prompt = build_rag_prompt(question, context)

        # Accumulate response for saving
        response_acc = Agent.start_link(fn -> "" end)

        wrapped_callback = fn chunk ->
          case response_acc do
            {:ok, pid} -> Agent.update(pid, fn acc -> acc <> chunk end)
            _ -> :ok
          end
          callback.(chunk)
        end

        case GeminiClient.generate_text_stream(prompt, wrapped_callback, max_tokens: 2000) do
          {:ok, :streamed, metadata} ->
            # Get accumulated response
            full_response =
              case response_acc do
                {:ok, pid} ->
                  response = Agent.get(pid, & &1)
                  Agent.stop(pid)
                  response
                _ ->
                  ""
              end

            # Save the conversation
            save_messages(project_id, user_id, question, full_response, sources, metadata)

            {:ok, %{sources: sources, usage: metadata}}

          {:error, reason} ->
            case response_acc do
              {:ok, pid} -> Agent.stop(pid)
              _ -> :ok
            end
            {:error, reason}
        end

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Get conversation history for a project.
  """
  @spec get_history(String.t(), keyword()) :: {:ok, [ChatMessage.t()]} | {:error, term()}
  def get_history(project_id, opts \\ []) do
    limit = Keyword.get(opts, :limit, 50)

    ChatMessage
    |> Ash.Query.for_read(:by_project, %{project_id: project_id})
    |> Ash.Query.limit(limit)
    |> Ash.Query.sort(inserted_at: :desc)
    |> Ash.read(authorize?: false)
    |> case do
      {:ok, messages} -> {:ok, Enum.reverse(messages)}
      error -> error
    end
  end

  @doc """
  Clear conversation history for a project.
  """
  @spec clear_history(String.t()) :: :ok | {:error, term()}
  def clear_history(project_id) do
    import Ecto.Query

    Backend.Repo.delete_all(
      from m in "chat_messages",
        where: m.project_id == ^project_id
    )

    :ok
  end

  @doc """
  Embed form responses into the project's knowledge base.
  """
  @spec embed_form_responses(String.t()) :: {:ok, integer()} | {:error, term()}
  def embed_form_responses(project_id) do
    case get_form_responses(project_id) do
      {:ok, responses} when responses != [] ->
        # Group by section for better context
        grouped = Enum.group_by(responses, & &1.section)

        results =
          Enum.map(grouped, fn {section, items} ->
            content = format_form_section(section, items)

            EmbeddingService.embed_and_store(project_id, content,
              source_type: :form_response,
              source_id: nil,
              metadata: %{section: section, question_count: length(items)}
            )
          end)

        successes = Enum.count(results, fn {status, _} -> status == :ok end)
        {:ok, successes}

      {:ok, []} ->
        {:ok, 0}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Add manual knowledge entry to the project's knowledge base.
  """
  @spec add_knowledge(String.t(), String.t(), String.t(), keyword()) ::
          {:ok, term()} | {:error, term()}
  def add_knowledge(project_id, title, content, opts \\ []) do
    user_id = Keyword.fetch!(opts, :user_id)
    category = Keyword.get(opts, :category, :other)
    raw_input = Keyword.get(opts, :raw_input)

    # Optionally process through AI to structure the content
    processed_content =
      if Keyword.get(opts, :ai_process, false) do
        case process_knowledge_with_ai(title, content) do
          {:ok, processed} -> processed
          _ -> content
        end
      else
        content
      end

    # Save the knowledge entry
    attrs = %{
      project_id: project_id,
      title: title,
      content: processed_content,
      raw_input: raw_input || content,
      category: category,
      metadata: Keyword.get(opts, :metadata, %{})
    }

    case create_knowledge_entry(attrs, user_id) do
      {:ok, entry} ->
        # Embed the content
        full_content = "# #{title}\nCategory: #{category}\n\n#{processed_content}"

        EmbeddingService.embed_and_store(project_id, full_content,
          source_type: :manual_entry,
          source_id: entry.id,
          metadata: %{title: title, category: category}
        )

        {:ok, entry}

      error ->
        error
    end
  end

  # =============================================================================
  # Private Functions - Context Building
  # =============================================================================

  defp build_context(project_id, question) do
    case EmbeddingService.search_similar(project_id, question,
           limit: @top_k_chunks,
           min_score: @min_similarity
         ) do
      {:ok, results} ->
        # Build context from results, respecting max size
        {context, sources} = build_context_from_results(results)
        {:ok, context, sources}

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp build_context_from_results(results) do
    {context_parts, sources, _size} =
      Enum.reduce_while(results, {[], [], 0}, fn {row, score}, {parts, srcs, size} ->
        content = row.content || ""
        content_size = String.length(content)

        if size + content_size > @max_context_chars do
          {:halt, {parts, srcs, size}}
        else
          source = %{
            source_type: row.source_type,
            source_id: row.source_id,
            score: Float.round(score, 3),
            preview: String.slice(content, 0, 200)
          }

          {:cont, {[content | parts], [source | srcs], size + content_size}}
        end
      end)

    context =
      context_parts
      |> Enum.reverse()
      |> Enum.with_index(1)
      |> Enum.map(fn {content, i} -> "[Context #{i}]\n#{content}" end)
      |> Enum.join("\n\n---\n\n")

    {context, Enum.reverse(sources)}
  end

  defp build_rag_prompt(question, context) do
    """
    You are a helpful AI assistant for a software development project. You have access to the project's knowledge base which includes customer requirements, technical specifications, design guidelines, and team notes.

    Use the following context to answer the question. If the answer isn't in the context, say so honestly but try to provide helpful information based on your general knowledge.

    Be concise but thorough. Use bullet points for lists. If referring to specific parts of the context, mention which source.

    ## Context from Project Knowledge Base

    #{context}

    ## Question

    #{question}

    ## Answer

    """
  end

  # =============================================================================
  # Private Functions - Data Operations
  # =============================================================================

  defp get_form_responses(project_id) do
    Backend.Portal.FormResponse
    |> Ash.Query.for_read(:by_project, %{project_id: project_id})
    |> Ash.read(authorize?: false)
  end

  defp format_form_section(section, items) do
    formatted_section = section |> String.replace("_", " ") |> String.capitalize()

    questions =
      items
      |> Enum.map(fn r ->
        key = r.question_key |> String.replace("_", " ") |> String.capitalize()
        value = format_answer(r.answer_value)
        "- #{key}: #{value}"
      end)
      |> Enum.join("\n")

    """
    ## Form Section: #{formatted_section}

    #{questions}
    """
  end

  defp format_answer(value) when is_map(value) do
    case Map.get(value, "value") || Map.get(value, :value) do
      nil -> Jason.encode!(value)
      v -> format_answer(v)
    end
  end

  defp format_answer(value) when is_list(value), do: Enum.join(value, ", ")
  defp format_answer(value) when is_boolean(value), do: if(value, do: "Yes", else: "No")
  defp format_answer(value), do: to_string(value)

  defp save_messages(project_id, user_id, question, response, sources, usage) do
    # Save user message
    ChatMessage
    |> Ash.Changeset.for_create(:create, %{
      project_id: project_id,
      user_id: user_id,
      role: :user,
      content: question
    })
    |> Ash.create(authorize?: false)

    # Save assistant message
    ChatMessage
    |> Ash.Changeset.for_create(:create, %{
      project_id: project_id,
      user_id: user_id,
      role: :assistant,
      content: response,
      metadata: %{
        sources: sources,
        tokens_used: usage
      }
    })
    |> Ash.create(authorize?: false)
  end

  defp create_knowledge_entry(attrs, user_id) do
    Backend.Portal.ManualKnowledgeEntry
    |> Ash.Changeset.for_create(:create, attrs)
    |> Ash.Changeset.force_change_attribute(:created_by_id, user_id)
    |> Ash.create(authorize?: false)
  end

  defp process_knowledge_with_ai(title, content) do
    prompt = """
    You are organizing information for a project knowledge base. Structure and improve the following content while preserving all important information.

    Title: #{title}

    Original content:
    #{content}

    Provide a well-structured version in Markdown format. Keep all facts and details, just organize them better with clear headings, bullet points where appropriate, and professional language.
    """

    case GeminiClient.generate_text(prompt, max_tokens: 1500) do
      {:ok, processed, _usage} -> {:ok, processed}
      error -> error
    end
  end
end
