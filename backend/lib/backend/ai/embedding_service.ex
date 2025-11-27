defmodule Backend.AI.EmbeddingService do
  @moduledoc """
  Service for creating and managing text embeddings.
  Handles chunking, embedding generation, and storage in the database.
  """

  alias Backend.AI.GeminiClient
  alias Backend.Portal.Embedding
  alias Backend.Repo

  require Logger

  # =============================================================================
  # Configuration
  # =============================================================================

  # Maximum characters per chunk (roughly 500-1000 tokens)
  @max_chunk_size 2000
  # Overlap between chunks to maintain context
  @chunk_overlap 200

  # =============================================================================
  # Public API
  # =============================================================================

  @doc """
  Embed content and store in the database.
  Handles chunking for long content.

  ## Options
  - `:source_type` - Type of source (form_response, document, generated_doc, manual_entry, image, company_info)
  - `:source_id` - UUID of the source record (optional)
  - `:metadata` - Additional metadata map
  """
  @spec embed_and_store(String.t(), String.t(), keyword()) ::
          {:ok, [Embedding.t()]} | {:error, term()}
  def embed_and_store(project_id, content, opts \\ []) do
    source_type = Keyword.fetch!(opts, :source_type)
    source_id = Keyword.get(opts, :source_id)
    metadata = Keyword.get(opts, :metadata, %{})

    # Chunk the content
    chunks = chunk_text(content)

    # Generate embeddings for all chunks
    case embed_chunks(chunks) do
      {:ok, embeddings} ->
        # Store each chunk with its embedding
        results =
          chunks
          |> Enum.zip(embeddings)
          |> Enum.with_index()
          |> Enum.map(fn {{chunk_text, embedding}, index} ->
            store_embedding(project_id, chunk_text, embedding, %{
              source_type: source_type,
              source_id: source_id,
              metadata: Map.merge(metadata, %{chunk_index: index, total_chunks: length(chunks)})
            })
          end)

        # Check if all succeeded
        case Enum.split_with(results, fn {status, _} -> status == :ok end) do
          {successes, []} ->
            {:ok, Enum.map(successes, fn {:ok, emb} -> emb end)}

          {_, failures} ->
            Logger.error("Some embeddings failed to store: #{inspect(failures)}")
            {:error, {:partial_failure, failures}}
        end

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Update embeddings for existing content.
  Deletes old embeddings and creates new ones.
  """
  @spec update_embeddings(String.t(), String.t(), String.t(), keyword()) ::
          {:ok, [Embedding.t()]} | {:error, term()}
  def update_embeddings(project_id, source_type, source_id, content, opts \\ []) do
    # Delete existing embeddings for this source
    delete_by_source(project_id, source_type, source_id)

    # Create new embeddings
    embed_and_store(project_id, content, Keyword.merge(opts, [
      source_type: source_type,
      source_id: source_id
    ]))
  end

  @doc """
  Delete all embeddings for a specific source.
  """
  @spec delete_by_source(String.t(), String.t(), String.t()) :: :ok
  def delete_by_source(project_id, source_type, source_id) do
    import Ecto.Query

    Repo.delete_all(
      from e in "embeddings",
        where: e.project_id == ^project_id and
               e.source_type == ^to_string(source_type) and
               e.source_id == ^source_id
    )

    :ok
  end

  @doc """
  Find similar embeddings using cosine similarity.
  Returns embeddings sorted by relevance.
  """
  @spec search_similar(String.t(), String.t(), keyword()) ::
          {:ok, [{Embedding.t(), float()}]} | {:error, term()}
  def search_similar(project_id, query_text, opts \\ []) do
    limit = Keyword.get(opts, :limit, 10)
    min_score = Keyword.get(opts, :min_score, 0.5)
    source_types = Keyword.get(opts, :source_types)

    # Generate embedding for query
    case GeminiClient.embed_text(query_text) do
      {:ok, query_embedding} ->
        search_by_embedding(project_id, query_embedding, limit, min_score, source_types)

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Search by pre-computed embedding vector.
  """
  @spec search_by_embedding(String.t(), [float()], integer(), float(), [String.t()] | nil) ::
          {:ok, [{Embedding.t(), float()}]} | {:error, term()}
  def search_by_embedding(project_id, query_embedding, limit \\ 10, min_score \\ 0.5, source_types \\ nil) do
    import Ecto.Query

    # Build base query
    base_query =
      from e in "embeddings",
        where: e.project_id == ^project_id,
        select: %{
          id: e.id,
          content: e.content,
          source_type: e.source_type,
          source_id: e.source_id,
          metadata: e.metadata,
          embedding: e.embedding
        }

    # Add source type filter if provided
    query =
      if source_types do
        from e in base_query,
          where: e.source_type in ^Enum.map(source_types, &to_string/1)
      else
        base_query
      end

    # Execute query and calculate similarities in memory
    # (For pgvector, we'd use the <=> operator directly in SQL)
    results = Repo.all(query)

    # Calculate cosine similarity for each result
    scored_results =
      results
      |> Enum.map(fn row ->
        embedding = row.embedding || []
        score = cosine_similarity(query_embedding, embedding)
        {row, score}
      end)
      |> Enum.filter(fn {_row, score} -> score >= min_score end)
      |> Enum.sort_by(fn {_row, score} -> score end, :desc)
      |> Enum.take(limit)

    {:ok, scored_results}
  end

  @doc """
  Get all embeddings for a project.
  """
  @spec list_by_project(String.t()) :: [Embedding.t()]
  def list_by_project(project_id) do
    Embedding
    |> Ash.Query.for_read(:by_project, %{project_id: project_id})
    |> Ash.read!(authorize?: false)
  end

  # =============================================================================
  # Text Chunking
  # =============================================================================

  @doc """
  Split text into chunks for embedding.
  Uses sentence-aware chunking with overlap.
  """
  @spec chunk_text(String.t()) :: [String.t()]
  def chunk_text(text) when byte_size(text) <= @max_chunk_size do
    [text]
  end

  def chunk_text(text) do
    # Split by paragraphs first
    paragraphs = String.split(text, ~r/\n\n+/)

    # Build chunks from paragraphs
    build_chunks(paragraphs, [], "", @max_chunk_size, @chunk_overlap)
  end

  defp build_chunks([], acc, current, _max_size, _overlap) when current == "" do
    Enum.reverse(acc)
  end

  defp build_chunks([], acc, current, _max_size, _overlap) do
    Enum.reverse([String.trim(current) | acc])
  end

  defp build_chunks([para | rest], acc, current, max_size, overlap) do
    candidate = if current == "", do: para, else: current <> "\n\n" <> para

    cond do
      # Candidate fits in current chunk
      String.length(candidate) <= max_size ->
        build_chunks(rest, acc, candidate, max_size, overlap)

      # Current chunk is not empty, save it and start new
      current != "" ->
        # Get overlap text from end of current chunk
        overlap_text = get_overlap_text(current, overlap)
        new_current = overlap_text <> "\n\n" <> para
        build_chunks(rest, [String.trim(current) | acc], new_current, max_size, overlap)

      # Paragraph itself is too long, split it
      true ->
        {first_part, remaining} = split_long_text(para, max_size, overlap)
        build_chunks([remaining | rest], [String.trim(first_part) | acc], "", max_size, overlap)
    end
  end

  defp get_overlap_text(text, overlap_size) do
    if String.length(text) > overlap_size do
      String.slice(text, -overlap_size, overlap_size)
    else
      text
    end
  end

  defp split_long_text(text, max_size, overlap) do
    # Try to split at sentence boundary
    sentences = String.split(text, ~r/(?<=[.!?])\s+/)

    {first_sentences, remaining_sentences} =
      Enum.reduce_while(sentences, {[], []}, fn sentence, {acc, []} ->
        joined = Enum.join(Enum.reverse([sentence | acc]), " ")
        if String.length(joined) > max_size and length(acc) > 0 do
          {:halt, {Enum.reverse(acc), [sentence | sentences -- [sentence | Enum.reverse(acc)]]}}
        else
          {:cont, {[sentence | acc], []}}
        end
      end)

    first_part = Enum.join(Enum.reverse(first_sentences), " ")
    remaining = Enum.join(remaining_sentences, " ")

    # If we couldn't split by sentence, force split
    if first_part == "" do
      {String.slice(text, 0, max_size - overlap), String.slice(text, max_size - overlap, String.length(text))}
    else
      {first_part, remaining}
    end
  end

  # =============================================================================
  # Embedding Generation
  # =============================================================================

  defp embed_chunks(chunks) when length(chunks) == 1 do
    case GeminiClient.embed_text(hd(chunks)) do
      {:ok, embedding} -> {:ok, [embedding]}
      error -> error
    end
  end

  defp embed_chunks(chunks) do
    # Use batch embedding for multiple chunks
    GeminiClient.embed_batch(chunks)
  end

  # =============================================================================
  # Storage
  # =============================================================================

  defp store_embedding(project_id, content, embedding, opts) do
    source_type = opts[:source_type]
    source_id = opts[:source_id]
    metadata = opts[:metadata] || %{}

    # Calculate content hash for deduplication
    content_hash = :crypto.hash(:sha256, content) |> Base.encode16(case: :lower)

    attrs = %{
      project_id: project_id,
      source_type: to_string(source_type),
      source_id: source_id,
      content: content,
      content_hash: content_hash,
      embedding: embedding,
      metadata: metadata
    }

    Embedding
    |> Ash.Changeset.for_create(:create, attrs)
    |> Ash.create(authorize?: false, upsert?: true, upsert_identity: :unique_content)
  end

  # =============================================================================
  # Similarity Calculation
  # =============================================================================

  @doc """
  Calculate cosine similarity between two vectors.
  """
  @spec cosine_similarity([float()], [float()]) :: float()
  def cosine_similarity(vec1, vec2) when length(vec1) == length(vec2) do
    dot_product = Enum.zip(vec1, vec2) |> Enum.reduce(0.0, fn {a, b}, acc -> acc + a * b end)
    magnitude1 = :math.sqrt(Enum.reduce(vec1, 0.0, fn x, acc -> acc + x * x end))
    magnitude2 = :math.sqrt(Enum.reduce(vec2, 0.0, fn x, acc -> acc + x * x end))

    if magnitude1 == 0.0 or magnitude2 == 0.0 do
      0.0
    else
      dot_product / (magnitude1 * magnitude2)
    end
  end

  def cosine_similarity(_, _), do: 0.0
end
