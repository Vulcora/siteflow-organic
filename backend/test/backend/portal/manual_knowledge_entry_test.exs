defmodule Backend.Portal.ManualKnowledgeEntryTest do
  use Backend.DataCase, async: true

  alias Backend.Portal.ManualKnowledgeEntry

  describe "manual knowledge entries" do
    setup do
      admin = create_admin_user()
      company = create_company()
      project = create_project(company)
      {:ok, admin: admin, company: company, project: project}
    end

    test "admin can create a knowledge entry", %{admin: admin, project: project} do
      attrs = %{
        project_id: project.id,
        title: "Meeting Notes - Kickoff",
        content: "Discussed project requirements and timeline.",
        category: :meeting_notes
      }

      assert {:ok, entry} =
               ManualKnowledgeEntry
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert entry.title == "Meeting Notes - Kickoff"
      assert entry.category == :meeting_notes
      assert entry.created_by_id == admin.id
    end

    test "creates entries with all categories", %{admin: admin, project: project} do
      categories = [:meeting_notes, :decision, :clarification, :feedback, :technical, :design, :other]

      for category <- categories do
        attrs = %{
          project_id: project.id,
          title: "#{category} Entry",
          content: "Content for #{category}",
          category: category
        }

        assert {:ok, entry} =
                 ManualKnowledgeEntry
                 |> Ash.Changeset.for_create(:create, attrs, actor: admin)
                 |> Ash.create()

        assert entry.category == category
      end
    end

    test "stores raw input for AI processing", %{admin: admin, project: project} do
      raw_input = "Customer mentioned they want dark mode. Also discussed mobile-first approach."

      attrs = %{
        project_id: project.id,
        title: "Customer Feedback - UI",
        content: "## Customer UI Preferences\n- Dark mode requested\n- Mobile-first design",
        raw_input: raw_input,
        category: :feedback
      }

      assert {:ok, entry} =
               ManualKnowledgeEntry
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert entry.raw_input == raw_input
    end

    test "by_project returns entries for a project", %{admin: admin, project: project} do
      _entry1 = create_knowledge_entry(project, admin, %{title: "Entry 1", category: :meeting_notes})
      _entry2 = create_knowledge_entry(project, admin, %{title: "Entry 2", category: :decision})
      _entry3 = create_knowledge_entry(project, admin, %{title: "Entry 3", category: :technical})

      {:ok, entries} =
        ManualKnowledgeEntry
        |> Ash.Query.for_read(:by_project, %{project_id: project.id}, actor: admin)
        |> Ash.read()

      assert length(entries) == 3
    end

    test "by_category filters entries", %{admin: admin, project: project} do
      _entry1 = create_knowledge_entry(project, admin, %{title: "Meeting 1", category: :meeting_notes})
      _entry2 = create_knowledge_entry(project, admin, %{title: "Meeting 2", category: :meeting_notes})
      _entry3 = create_knowledge_entry(project, admin, %{title: "Decision 1", category: :decision})

      {:ok, meeting_entries} =
        ManualKnowledgeEntry
        |> Ash.Query.for_read(:by_category, %{
          project_id: project.id,
          category: :meeting_notes
        }, actor: admin)
        |> Ash.read()

      assert length(meeting_entries) == 2
      assert Enum.all?(meeting_entries, &(&1.category == :meeting_notes))
    end

    test "creator can update their own entry", %{admin: admin, project: project} do
      entry = create_knowledge_entry(project, admin)

      assert {:ok, updated} =
               entry
               |> Ash.Changeset.for_update(:update, %{
                 title: "Updated Title",
                 content: "Updated content"
               }, actor: admin)
               |> Ash.update()

      assert updated.title == "Updated Title"
    end

    test "creator can delete their own entry", %{admin: admin, project: project} do
      entry = create_knowledge_entry(project, admin)

      assert :ok =
               entry
               |> Ash.Changeset.for_destroy(:destroy, %{}, actor: admin)
               |> Ash.destroy()
    end

    test "stores metadata", %{admin: admin, project: project} do
      metadata = %{
        source: "customer_email",
        date: "2025-11-27",
        participants: ["Customer", "PM"]
      }

      attrs = %{
        project_id: project.id,
        title: "Email Summary",
        content: "Summary of customer email",
        category: :clarification,
        metadata: metadata
      }

      assert {:ok, entry} =
               ManualKnowledgeEntry
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert entry.metadata["source"] == "customer_email"
      assert entry.metadata["participants"] == ["Customer", "PM"]
    end
  end
end
