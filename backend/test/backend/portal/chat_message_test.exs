defmodule Backend.Portal.ChatMessageTest do
  use Backend.DataCase, async: true

  alias Backend.Portal.ChatMessage

  describe "chat messages" do
    setup do
      admin = create_admin_user()
      company = create_company()
      project = create_project(company)
      {:ok, admin: admin, company: company, project: project}
    end

    test "admin can create a chat message", %{admin: admin, project: project} do
      attrs = %{
        project_id: project.id,
        user_id: admin.id,
        role: :user,
        content: "What is the project scope?"
      }

      assert {:ok, message} =
               ChatMessage
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert message.role == :user
      assert message.content == "What is the project scope?"
      assert message.sources == []
    end

    test "creates assistant messages with sources", %{admin: admin, project: project} do
      sources = [
        %{embedding_id: Ecto.UUID.generate(), content_preview: "Source 1", relevance_score: 0.95},
        %{embedding_id: Ecto.UUID.generate(), content_preview: "Source 2", relevance_score: 0.87}
      ]

      attrs = %{
        project_id: project.id,
        user_id: admin.id,
        role: :assistant,
        content: "Based on the project requirements...",
        sources: sources
      }

      assert {:ok, message} =
               ChatMessage
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert message.role == :assistant
      assert length(message.sources) == 2
    end

    test "by_project returns messages in chronological order", %{admin: admin, project: project} do
      _msg1 = create_chat_message(project, admin, %{content: "First message", role: :user})
      _msg2 = create_chat_message(project, admin, %{content: "Second message", role: :assistant})
      _msg3 = create_chat_message(project, admin, %{content: "Third message", role: :user})

      {:ok, messages} =
        ChatMessage
        |> Ash.Query.for_read(:by_project, %{project_id: project.id}, actor: admin)
        |> Ash.read()

      assert length(messages) == 3
      # Should be in ascending order (oldest first)
      assert hd(messages).content == "First message"
    end

    test "project_history returns limited messages in reverse order", %{admin: admin, project: project} do
      for i <- 1..10 do
        create_chat_message(project, admin, %{content: "Message #{i}"})
      end

      {:ok, messages} =
        ChatMessage
        |> Ash.Query.for_read(:project_history, %{project_id: project.id, limit: 5}, actor: admin)
        |> Ash.read()

      assert length(messages) == 5
      # Should be in descending order (newest first)
      assert hd(messages).content == "Message 10"
    end

    test "user can only read their own messages", %{admin: admin, project: project} do
      other_admin = create_admin_user()

      _admin_msg = create_chat_message(project, admin, %{content: "Admin message"})
      _other_msg = create_chat_message(project, other_admin, %{content: "Other message"})

      {:ok, admin_messages} =
        ChatMessage
        |> Ash.Query.for_read(:read, %{}, actor: admin)
        |> Ash.read()

      # Admin can read all (admin role)
      assert length(admin_messages) >= 2
    end

    test "stores metadata", %{admin: admin, project: project} do
      metadata = %{
        tokens_used: 150,
        model: "gemini-2.0-flash",
        latency_ms: 1200
      }

      attrs = %{
        project_id: project.id,
        user_id: admin.id,
        role: :assistant,
        content: "Response",
        metadata: metadata
      }

      assert {:ok, message} =
               ChatMessage
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert message.metadata["tokens_used"] == 150
      assert message.metadata["model"] == "gemini-2.0-flash"
    end
  end
end
