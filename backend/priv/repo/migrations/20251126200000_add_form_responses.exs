defmodule Backend.Repo.Migrations.AddFormResponses do
  @moduledoc """
  Adds form_responses table for storing dynamic project questionnaire answers.
  """

  use Ecto.Migration

  def up do
    create table(:form_responses, primary_key: false) do
      add :id, :uuid, null: false, default: fragment("gen_random_uuid()"), primary_key: true

      add :form_type, :text, null: false
      add :section, :text, null: false
      add :question_key, :text, null: false
      add :answer_value, :map, null: false
      add :answer_metadata, :map

      add :inserted_at, :utc_datetime_usec,
        null: false,
        default: fragment("(now() AT TIME ZONE 'utc')")

      add :updated_at, :utc_datetime_usec,
        null: false,
        default: fragment("(now() AT TIME ZONE 'utc')")

      add :project_id,
          references(:projects,
            column: :id,
            name: "form_responses_project_id_fkey",
            type: :uuid,
            prefix: "public",
            on_delete: :delete_all
          ),
          null: false
    end

    create unique_index(:form_responses, [:project_id, :form_type, :question_key],
             name: "form_responses_unique_question_per_project_index"
           )

    create index(:form_responses, [:project_id], name: "form_responses_project_id_index")
    create index(:form_responses, [:form_type], name: "form_responses_form_type_index")
    create index(:form_responses, [:section], name: "form_responses_section_index")
  end

  def down do
    drop_if_exists index(:form_responses, [:section], name: "form_responses_section_index")
    drop_if_exists index(:form_responses, [:form_type], name: "form_responses_form_type_index")
    drop_if_exists index(:form_responses, [:project_id], name: "form_responses_project_id_index")

    drop_if_exists unique_index(:form_responses, [:project_id, :form_type, :question_key],
                     name: "form_responses_unique_question_per_project_index"
                   )

    drop constraint(:form_responses, "form_responses_project_id_fkey")
    drop table(:form_responses)
  end
end
