defmodule Backend.AI.DocumentGenerator do
  @moduledoc """
  Generates structured documents from form responses using AI.
  Creates project specifications, technical requirements, design briefs, and budget/timeline docs.
  """

  alias Backend.AI.GeminiClient
  alias Backend.AI.EmbeddingService
  alias Backend.Portal.FormResponse
  alias Backend.Portal.GeneratedDocument

  require Logger

  # =============================================================================
  # Document Types
  # =============================================================================

  @document_types [:project_spec, :technical_requirements, :design_brief, :budget_timeline]

  # =============================================================================
  # Public API
  # =============================================================================

  @doc """
  Generate all documents for a project based on its form responses.
  Returns a list of generated documents.
  """
  @spec generate_all_documents(String.t(), String.t() | nil) ::
          {:ok, [GeneratedDocument.t()]} | {:error, term()}
  def generate_all_documents(project_id, user_id \\ nil) do
    # Fetch all form responses for the project
    case get_form_responses(project_id) do
      {:ok, responses} when responses != [] ->
        # Group responses by section for easier processing
        grouped_responses = group_responses_by_section(responses)

        # Generate each document type
        results =
          @document_types
          |> Enum.map(fn doc_type ->
            generate_document(project_id, doc_type, grouped_responses, user_id)
          end)

        # Split successes and failures
        {successes, failures} = Enum.split_with(results, fn {status, _} -> status == :ok end)

        if failures == [] do
          {:ok, Enum.map(successes, fn {:ok, doc} -> doc end)}
        else
          Logger.error("Some documents failed to generate: #{inspect(failures)}")
          {:error, {:partial_failure, failures}}
        end

      {:ok, []} ->
        {:error, :no_form_responses}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Generate a specific document type for a project.
  """
  @spec generate_document(String.t(), atom(), map(), String.t() | nil) ::
          {:ok, GeneratedDocument.t()} | {:error, term()}
  def generate_document(project_id, document_type, grouped_responses, user_id \\ nil)
      when document_type in @document_types do
    # Build the prompt for this document type
    prompt = build_prompt(document_type, grouped_responses)

    # Generate content using AI
    start_time = System.monotonic_time(:millisecond)

    case GeminiClient.generate_text(prompt, max_tokens: 4000) do
      {:ok, content, usage} ->
        generation_time = System.monotonic_time(:millisecond) - start_time

        # Create or update the document
        save_generated_document(project_id, document_type, content, user_id, %{
          model: "gemini-2.0-flash-exp",
          tokens_used: usage,
          generation_time_ms: generation_time,
          generated_at: DateTime.utc_now()
        })

      {:error, reason} ->
        Logger.error("Failed to generate #{document_type}: #{inspect(reason)}")
        {:error, reason}
    end
  end

  @doc """
  Regenerate a specific document (increments version).
  """
  @spec regenerate_document(String.t(), atom(), String.t() | nil) ::
          {:ok, GeneratedDocument.t()} | {:error, term()}
  def regenerate_document(project_id, document_type, user_id \\ nil) do
    case get_form_responses(project_id) do
      {:ok, responses} when responses != [] ->
        grouped_responses = group_responses_by_section(responses)
        prompt = build_prompt(document_type, grouped_responses)

        start_time = System.monotonic_time(:millisecond)

        case GeminiClient.generate_text(prompt, max_tokens: 4000) do
          {:ok, content, usage} ->
            generation_time = System.monotonic_time(:millisecond) - start_time

            metadata = %{
              model: "gemini-2.0-flash-exp",
              tokens_used: usage,
              generation_time_ms: generation_time,
              regenerated_at: DateTime.utc_now()
            }

            # Try to find existing document and regenerate
            case find_existing_document(project_id, document_type) do
              {:ok, existing} ->
                existing
                |> Ash.Changeset.for_update(:regenerate, %{
                  content: content,
                  generation_metadata: metadata
                })
                |> Ash.update(authorize?: false)

              {:error, :not_found} ->
                # Create new if doesn't exist
                save_generated_document(project_id, document_type, content, user_id, metadata)
            end

          {:error, reason} ->
            {:error, reason}
        end

      {:ok, []} ->
        {:error, :no_form_responses}

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Embed all generated documents for a project into the vector store.
  """
  @spec embed_documents(String.t()) :: {:ok, integer()} | {:error, term()}
  def embed_documents(project_id) do
    case list_documents(project_id) do
      {:ok, documents} ->
        results =
          Enum.map(documents, fn doc ->
            # Create structured content with title and document type context
            content = """
            # #{doc.title}
            Document Type: #{doc.document_type}

            #{doc.content}
            """

            EmbeddingService.embed_and_store(project_id, content,
              source_type: :generated_doc,
              source_id: doc.id,
              metadata: %{
                document_type: doc.document_type,
                title: doc.title,
                version: doc.version
              }
            )
          end)

        successes = Enum.count(results, fn {status, _} -> status == :ok end)
        {:ok, successes}

      {:error, reason} ->
        {:error, reason}
    end
  end

  # =============================================================================
  # Private Functions - Data Fetching
  # =============================================================================

  defp get_form_responses(project_id) do
    FormResponse
    |> Ash.Query.for_read(:by_project, %{project_id: project_id})
    |> Ash.read(authorize?: false)
  end

  defp group_responses_by_section(responses) do
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

  defp find_existing_document(project_id, document_type) do
    case GeneratedDocument
         |> Ash.Query.for_read(:by_project_and_type, %{
           project_id: project_id,
           document_type: to_string(document_type)
         })
         |> Ash.read_one(authorize?: false) do
      {:ok, nil} -> {:error, :not_found}
      {:ok, doc} -> {:ok, doc}
      error -> error
    end
  end

  defp list_documents(project_id) do
    GeneratedDocument
    |> Ash.Query.for_read(:by_project, %{project_id: project_id})
    |> Ash.read(authorize?: false)
  end

  defp save_generated_document(project_id, document_type, content, user_id, metadata) do
    title = document_type_to_title(document_type)

    attrs = %{
      project_id: project_id,
      document_type: document_type,
      title: title,
      content: content,
      generated_by_id: user_id,
      generation_metadata: metadata
    }

    GeneratedDocument
    |> Ash.Changeset.for_create(:create, attrs)
    |> Ash.create(
      authorize?: false,
      upsert?: true,
      upsert_identity: :unique_type_per_project
    )
  end

  defp document_type_to_title(:project_spec), do: "Project Specification"
  defp document_type_to_title(:technical_requirements), do: "Technical Requirements"
  defp document_type_to_title(:design_brief), do: "Design Brief"
  defp document_type_to_title(:budget_timeline), do: "Budget & Timeline"

  # =============================================================================
  # Private Functions - Prompt Building
  # =============================================================================

  defp build_prompt(:project_spec, responses) do
    """
    You are a professional business analyst. Based on the following customer questionnaire responses,
    create a comprehensive Project Specification document in Markdown format.

    The document should include:
    1. Executive Summary - Brief overview of the project
    2. Project Goals - What the customer wants to achieve
    3. Target Audience - Who will use the product/service
    4. Scope - What's included and excluded
    5. Success Criteria - How success will be measured
    6. Key Stakeholders - Who's involved
    7. Constraints & Assumptions - Any limitations or assumptions

    Write in a professional, clear tone. Use bullet points where appropriate.
    The document should be actionable and serve as a reference for the project team.

    Customer Responses:
    #{format_responses(responses)}

    Generate the Project Specification document in Markdown:
    """
  end

  defp build_prompt(:technical_requirements, responses) do
    """
    You are a senior technical architect. Based on the following customer questionnaire responses,
    create a detailed Technical Requirements document in Markdown format.

    The document should include:
    1. System Overview - High-level technical architecture
    2. Functional Requirements - What the system must do
    3. Non-Functional Requirements - Performance, security, scalability
    4. Integration Requirements - APIs, third-party services, data sources
    5. Technology Stack - Recommended technologies and frameworks
    6. Data Requirements - Data models, storage, migration needs
    7. Security Requirements - Authentication, authorization, compliance
    8. Infrastructure Requirements - Hosting, deployment, environments

    Be specific and technical. Include concrete recommendations where possible.
    Flag any areas that need further clarification from the customer.

    Customer Responses:
    #{format_responses(responses)}

    Generate the Technical Requirements document in Markdown:
    """
  end

  defp build_prompt(:design_brief, responses) do
    """
    You are a UX/UI design lead. Based on the following customer questionnaire responses,
    create a comprehensive Design Brief document in Markdown format.

    The document should include:
    1. Brand Overview - Company identity, values, tone
    2. Visual Direction - Colors, typography, imagery preferences
    3. User Experience Goals - Key UX objectives
    4. Reference & Inspiration - Competitor analysis, design references
    5. Component Requirements - Key UI components needed
    6. Responsive Design - Device and screen size requirements
    7. Accessibility Requirements - WCAG compliance level, specific needs
    8. Content Strategy - Content types, hierarchy, CMS needs

    Be creative but practical. Consider both aesthetic and functional aspects.
    Include any brand guidelines mentioned by the customer.

    Customer Responses:
    #{format_responses(responses)}

    Generate the Design Brief document in Markdown:
    """
  end

  defp build_prompt(:budget_timeline, responses) do
    """
    You are a project manager. Based on the following customer questionnaire responses,
    create a Budget & Timeline document in Markdown format.

    The document should include:
    1. Project Timeline Overview - Key phases and milestones
    2. Phase Breakdown - Detailed breakdown of each phase
       - Discovery & Planning
       - Design Phase
       - Development Phase
       - Testing & QA
       - Launch & Deployment
    3. Resource Allocation - Team composition needs
    4. Budget Considerations - Based on stated budget range
    5. Risk Factors - Potential timeline/budget risks
    6. Dependencies - What needs to happen when
    7. Deliverables - What will be delivered at each phase

    Be realistic with estimates. Flag any concerns about scope vs. budget.
    Include buffer time for revisions and unexpected issues.

    Customer Responses:
    #{format_responses(responses)}

    Generate the Budget & Timeline document in Markdown:
    """
  end

  defp format_responses(grouped_responses) do
    grouped_responses
    |> Enum.sort_by(fn {section, _} -> section end)
    |> Enum.map(fn {section, questions} ->
      formatted_section = section |> String.replace("_", " ") |> String.capitalize()

      formatted_questions =
        questions
        |> Enum.map(fn {key, value} ->
          formatted_key = key |> String.replace("_", " ") |> String.capitalize()
          formatted_value = format_answer_value(value)
          "  - #{formatted_key}: #{formatted_value}"
        end)
        |> Enum.join("\n")

      """
      ## #{formatted_section}
      #{formatted_questions}
      """
    end)
    |> Enum.join("\n")
  end

  defp format_answer_value(value) when is_map(value) do
    # Handle maps with "value" key (common pattern)
    case Map.get(value, "value") || Map.get(value, :value) do
      nil -> Jason.encode!(value)
      v -> format_answer_value(v)
    end
  end

  defp format_answer_value(value) when is_list(value) do
    Enum.join(value, ", ")
  end

  defp format_answer_value(value) when is_boolean(value) do
    if value, do: "Yes", else: "No"
  end

  defp format_answer_value(value), do: to_string(value)
end
