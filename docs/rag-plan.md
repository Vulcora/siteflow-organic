Create a detailed implementation plan for adding a RAG (Retrieval Augmented Generation) system to an existing Elixir/Phoenix + React application.

## Current Tech Stack
- **Backend**: Elixir/Phoenix with Ash Framework
- **Database**: PostgreSQL
- **Frontend**: React with TypeScript, Vite, TanStack Query
- **AI**: Google Gemini (already integrated for simple assessments)
- **Auth**: JWT-based authentication

## Existing Systems to Build On
1. **FormResponse** - Stores customer questionnaire answers (website/system projects)
   - Fields: project_id, form_type, section, question_key, answer_value, answer_metadata
   - Rich structured data about customer requirements, goals, budget, timeline

2. **Document** - File metadata storage (actual file storage not yet implemented)
   - Fields: name, description, file_path, file_size, mime_type, category, project_id

3. **Project** - Has companies, tickets, time entries, internal notes

## Requirements
1. **Automatic Document Generation**: When customer completes all form questions, AI should:
   - Take all answers and structure them into logical documents
   - Generate documents like: Project Specification, Technical Requirements, Design Brief, Budget & Timeline
   - Documents should be in English (translatable in UI)
   - Store generated documents for the project

2. **Vector Database**: Use pgvector (PostgreSQL extension)
   - Each project gets its own "namespace" or collection
   - Index: form responses, generated documents, uploaded files (including images)
   - Store embeddings for semantic search

3. **RAG Chat Interface**: 
   - Dedicated page per project for AI chat
   - AI has full insight into project's indexed content
   - Admin/developers can chat with the project's knowledge base

4. **Manual RAG Updates**:
   - Admin/dev can add new information to the RAG
   - Can be done via AI (write something, AI structures and saves it)
   - Updates should be reflected in the vector index

5. **Image Handling**:
   - Uploaded images should be indexed in RAG
   - Use vision capabilities or OCR for image content

## Technical Considerations
- Gemini has embedding API (text-embedding-004 model)
- Gemini has vision capabilities for images
- Need actual file storage before indexing files (S3, local, etc.)
- Phoenix can handle long-running AI tasks via GenServer/Task

Please provide a detailed implementation plan with:
1. Database schema changes (migrations)
2. New Ash resources needed
3. Backend services/modules
4. API endpoints
5. Frontend components
6. Implementation order/phases
7. Key files that need to be modified