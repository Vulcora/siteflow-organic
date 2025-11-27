defmodule Backend.AI.GeminiClient do
  @moduledoc """
  HTTP client for Google Gemini API.
  Handles embeddings, text generation, and vision capabilities.
  """

  require Logger

  @base_url "https://generativelanguage.googleapis.com/v1beta"

  # =============================================================================
  # Configuration
  # =============================================================================

  defp config do
    Application.get_env(:backend, :gemini, [])
  end

  defp api_key, do: config()[:api_key]
  defp embedding_model, do: config()[:embedding_model] || "text-embedding-004"
  defp generation_model, do: config()[:generation_model] || "gemini-2.0-flash-exp"
  defp embedding_dimensions, do: config()[:embedding_dimensions] || 768

  # =============================================================================
  # Embeddings
  # =============================================================================

  @doc """
  Generate embeddings for a text string.
  Returns a list of floats (768 dimensions for text-embedding-004).
  """
  @spec embed_text(String.t()) :: {:ok, [float()]} | {:error, term()}
  def embed_text(text) when is_binary(text) do
    url = "#{@base_url}/models/#{embedding_model()}:embedContent?key=#{api_key()}"

    body = %{
      model: "models/#{embedding_model()}",
      content: %{
        parts: [%{text: text}]
      }
    }

    case Req.post(url, json: body) do
      {:ok, %{status: 200, body: %{"embedding" => %{"values" => values}}}} ->
        {:ok, values}

      {:ok, %{status: status, body: body}} ->
        Logger.error("Gemini embed error: #{status} - #{inspect(body)}")
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Logger.error("Gemini embed request failed: #{inspect(reason)}")
        {:error, {:request_failed, reason}}
    end
  end

  @doc """
  Generate embeddings for multiple texts in batch.
  More efficient than calling embed_text multiple times.
  """
  @spec embed_batch([String.t()]) :: {:ok, [[float()]]} | {:error, term()}
  def embed_batch(texts) when is_list(texts) do
    url = "#{@base_url}/models/#{embedding_model()}:batchEmbedContents?key=#{api_key()}"

    requests = Enum.map(texts, fn text ->
      %{
        model: "models/#{embedding_model()}",
        content: %{parts: [%{text: text}]}
      }
    end)

    body = %{requests: requests}

    case Req.post(url, json: body) do
      {:ok, %{status: 200, body: %{"embeddings" => embeddings}}} ->
        values = Enum.map(embeddings, & &1["values"])
        {:ok, values}

      {:ok, %{status: status, body: body}} ->
        Logger.error("Gemini batch embed error: #{status} - #{inspect(body)}")
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Logger.error("Gemini batch embed request failed: #{inspect(reason)}")
        {:error, {:request_failed, reason}}
    end
  end

  # =============================================================================
  # Text Generation
  # =============================================================================

  @doc """
  Generate text using Gemini model.
  Returns the generated text content.
  """
  @spec generate_text(String.t(), keyword()) :: {:ok, String.t(), map()} | {:error, term()}
  def generate_text(prompt, opts \\ []) do
    model = Keyword.get(opts, :model, generation_model())
    system_instruction = Keyword.get(opts, :system_instruction)
    temperature = Keyword.get(opts, :temperature, 0.7)
    max_tokens = Keyword.get(opts, :max_tokens, 8192)

    url = "#{@base_url}/models/#{model}:generateContent?key=#{api_key()}"

    body = %{
      contents: [%{parts: [%{text: prompt}]}],
      generationConfig: %{
        temperature: temperature,
        maxOutputTokens: max_tokens
      }
    }

    body = if system_instruction do
      Map.put(body, :systemInstruction, %{parts: [%{text: system_instruction}]})
    else
      body
    end

    case Req.post(url, json: body) do
      {:ok, %{status: 200, body: response_body}} ->
        case extract_text_from_response(response_body) do
          {:ok, text} ->
            metadata = %{
              model: model,
              usage: response_body["usageMetadata"],
              finish_reason: get_in(response_body, ["candidates", Access.at(0), "finishReason"])
            }
            {:ok, text, metadata}

          {:error, reason} ->
            {:error, reason}
        end

      {:ok, %{status: status, body: body}} ->
        Logger.error("Gemini generate error: #{status} - #{inspect(body)}")
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Logger.error("Gemini generate request failed: #{inspect(reason)}")
        {:error, {:request_failed, reason}}
    end
  end

  @doc """
  Generate text with streaming response.
  Calls the callback function with each chunk of text.
  """
  @spec generate_text_stream(String.t(), (String.t() -> any()), keyword()) ::
          {:ok, String.t(), map()} | {:error, term()}
  def generate_text_stream(prompt, callback, opts \\ []) do
    model = Keyword.get(opts, :model, generation_model())
    system_instruction = Keyword.get(opts, :system_instruction)
    temperature = Keyword.get(opts, :temperature, 0.7)
    max_tokens = Keyword.get(opts, :max_tokens, 8192)

    url = "#{@base_url}/models/#{model}:streamGenerateContent?key=#{api_key()}&alt=sse"

    body = %{
      contents: [%{parts: [%{text: prompt}]}],
      generationConfig: %{
        temperature: temperature,
        maxOutputTokens: max_tokens
      }
    }

    body = if system_instruction do
      Map.put(body, :systemInstruction, %{parts: [%{text: system_instruction}]})
    else
      body
    end

    final_metadata = %{model: model}

    # Use Req with streaming
    case Req.post(url, json: body, into: fn {:data, data}, {req, resp} ->
      # Parse SSE data
      case parse_sse_chunk(data) do
        {:ok, chunk_text} when chunk_text != "" ->
          callback.(chunk_text)
          {req, resp}

        _ ->
          {req, resp}
      end
    end) do
      {:ok, %{status: 200}} ->
        # For streaming, we don't have the full text easily
        # The callback has been called with each chunk
        {:ok, :streamed, final_metadata}

      {:ok, %{status: status, body: body}} ->
        Logger.error("Gemini stream error: #{status} - #{inspect(body)}")
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Logger.error("Gemini stream request failed: #{inspect(reason)}")
        {:error, {:request_failed, reason}}
    end
  end

  # =============================================================================
  # Vision (Image Analysis)
  # =============================================================================

  @doc """
  Analyze an image and generate text description/analysis.
  Image can be base64 encoded data or a URL.
  """
  @spec analyze_image(String.t(), String.t(), keyword()) :: {:ok, String.t(), map()} | {:error, term()}
  def analyze_image(image_data, prompt, opts \\ []) do
    model = Keyword.get(opts, :model, "gemini-2.0-flash-exp")
    mime_type = Keyword.get(opts, :mime_type, "image/jpeg")

    url = "#{@base_url}/models/#{model}:generateContent?key=#{api_key()}"

    image_part = if String.starts_with?(image_data, "http") do
      # URL-based image
      %{fileData: %{mimeType: mime_type, fileUri: image_data}}
    else
      # Base64 encoded image
      %{inlineData: %{mimeType: mime_type, data: image_data}}
    end

    body = %{
      contents: [%{
        parts: [
          image_part,
          %{text: prompt}
        ]
      }]
    }

    case Req.post(url, json: body) do
      {:ok, %{status: 200, body: response_body}} ->
        case extract_text_from_response(response_body) do
          {:ok, text} ->
            metadata = %{
              model: model,
              usage: response_body["usageMetadata"]
            }
            {:ok, text, metadata}

          {:error, reason} ->
            {:error, reason}
        end

      {:ok, %{status: status, body: body}} ->
        Logger.error("Gemini vision error: #{status} - #{inspect(body)}")
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Logger.error("Gemini vision request failed: #{inspect(reason)}")
        {:error, {:request_failed, reason}}
    end
  end

  # =============================================================================
  # Helpers
  # =============================================================================

  defp extract_text_from_response(response) do
    case get_in(response, ["candidates", Access.at(0), "content", "parts", Access.at(0), "text"]) do
      nil -> {:error, :no_text_in_response}
      text -> {:ok, text}
    end
  end

  defp parse_sse_chunk(data) do
    # SSE format: data: {...json...}\n\n
    data
    |> String.split("\n")
    |> Enum.reduce("", fn line, acc ->
      case String.trim_leading(line, "data: ") do
        "" -> acc
        json_str ->
          case Jason.decode(json_str) do
            {:ok, parsed} ->
              case get_in(parsed, ["candidates", Access.at(0), "content", "parts", Access.at(0), "text"]) do
                nil -> acc
                text -> acc <> text
              end
            _ -> acc
          end
      end
    end)
    |> case do
      "" -> {:ok, ""}
      text -> {:ok, text}
    end
  end

  @doc """
  Check if the API key is configured.
  """
  @spec configured?() :: boolean()
  def configured? do
    api_key() != nil and api_key() != ""
  end

  @doc """
  Get the embedding dimensions for the configured model.
  """
  @spec get_embedding_dimensions() :: integer()
  def get_embedding_dimensions do
    embedding_dimensions()
  end
end
