defmodule Backend.Portal.GeneratedDocumentTest do
  use Backend.DataCase, async: true

  alias Backend.Portal.GeneratedDocument

  describe "generated documents" do
    setup do
      admin = create_admin_user()
      company = create_company()
      project = create_project(company)
      {:ok, admin: admin, company: company, project: project}
    end

    test "admin can create a generated document", %{admin: admin, project: project} do
      attrs = %{
        project_id: project.id,
        document_type: :project_spec,
        title: "Project Specification",
        content: "# Project Spec\n\nThis is the specification.",
        generated_by_id: admin.id
      }

      assert {:ok, doc} =
               GeneratedDocument
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()

      assert doc.document_type == :project_spec
      assert doc.title == "Project Specification"
      assert doc.status == :draft
      assert doc.version == 1
    end

    test "creates all document types", %{admin: admin, project: project} do
      types = [:project_spec, :technical_requirements, :design_brief, :budget_timeline]

      for type <- types do
        attrs = %{
          project_id: project.id,
          document_type: type,
          title: "#{type} Document",
          content: "Content for #{type}",
          generated_by_id: admin.id
        }

        assert {:ok, doc} =
                 GeneratedDocument
                 |> Ash.Changeset.for_create(:create, attrs, actor: admin)
                 |> Ash.create()

        assert doc.document_type == type
      end
    end

    test "publishes a document", %{admin: admin, project: project} do
      doc = create_generated_document(project, admin)
      assert doc.status == :draft

      assert {:ok, published_doc} =
               doc
               |> Ash.Changeset.for_update(:publish, %{}, actor: admin)
               |> Ash.update()

      assert published_doc.status == :published
    end

    test "archives a document", %{admin: admin, project: project} do
      doc = create_generated_document(project, admin)

      assert {:ok, archived_doc} =
               doc
               |> Ash.Changeset.for_update(:archive, %{}, actor: admin)
               |> Ash.update()

      assert archived_doc.status == :archived
    end

    test "regenerates a document with version increment", %{admin: admin, project: project} do
      doc = create_generated_document(project, admin)
      assert doc.version == 1

      assert {:ok, regenerated} =
               doc
               |> Ash.Changeset.for_update(:regenerate, %{
                 content: "Updated content",
                 generation_metadata: %{model: "gemini-2.0-flash"}
               }, actor: admin)
               |> Ash.update()

      assert regenerated.version == 2
      assert regenerated.content == "Updated content"
    end

    test "enforces unique document type per project", %{admin: admin, project: project} do
      # Create first document
      _doc1 = create_generated_document(project, admin, %{document_type: :project_spec})

      # Try to create duplicate
      attrs = %{
        project_id: project.id,
        document_type: :project_spec,
        title: "Duplicate",
        content: "Content"
      }

      assert {:error, _} =
               GeneratedDocument
               |> Ash.Changeset.for_create(:create, attrs, actor: admin)
               |> Ash.create()
    end

    test "by_project returns documents for a project", %{admin: admin, project: project} do
      _doc1 = create_generated_document(project, admin, %{document_type: :project_spec})
      _doc2 = create_generated_document(project, admin, %{document_type: :design_brief})

      {:ok, docs} =
        GeneratedDocument
        |> Ash.Query.for_read(:by_project, %{project_id: project.id}, actor: admin)
        |> Ash.read()

      assert length(docs) == 2
    end

    test "by_project_and_type returns specific document", %{admin: admin, project: project} do
      _doc = create_generated_document(project, admin, %{document_type: :project_spec})

      {:ok, found} =
        GeneratedDocument
        |> Ash.Query.for_read(:by_project_and_type, %{
          project_id: project.id,
          document_type: :project_spec
        }, actor: admin)
        |> Ash.read_one()

      assert found != nil
      assert found.document_type == :project_spec
    end
  end
end
