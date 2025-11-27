<div align="center">

# 🚀 Siteflow Customer Portal

**En modern B2B SaaS-plattform för digital projekthantering**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)](https://reactjs.org/)
[![Elixir](https://img.shields.io/badge/Elixir-1.15-purple?logo=elixir)](https://elixir-lang.org/)
[![Phoenix](https://img.shields.io/badge/Phoenix-1.7-orange?logo=phoenixframework)](https://www.phoenixframework.org/)
[![Ash Framework](https://img.shields.io/badge/Ash-3.0-green)](https://ash-hq.org/)
[![Tests](https://img.shields.io/badge/Tests-300%20passing-success)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Architecture](#-architecture) • [API Docs](#-api-documentation)

</div>

---

## 📖 Overview

Siteflow Customer Portal är en fullstack B2B SaaS-lösning som digitaliserar hela kundresan för webbutvecklings- och systemprojekt - från initial förfrågan till leverans och support.

### 🎯 Huvudfunktioner

- 🔐 **Rollbaserat system** - Admin, KAM, Project Leader, Developer, Customer roles
- 📝 **Dynamiska formulär** - 55 frågor för hemsida/system-projekt med multi-step wizard
- 🤖 **AI/RAG Integration** - Automatisk dokumentgenerering med Google Gemini
- 📊 **Produktplaner** - State machine för kundgodkännande
- ⏱️ **Timeline & Milestolpar** - Visuell projektuppföljning
- 📅 **Möten & Kalender** - Google Calendar-liknande schemaläggning
- 🎫 **Ticket-system** - Support med state machine (open → in_progress → resolved)
- ⏰ **Tidsrapportering** - Per-projekt timetracking med fakturering
- 📁 **Dokumenthantering** - Google Drive-liknande filhantering
- 🌍 **i18n Support** - Svenska och Engelska

---

## 🖼️ Screenshots

<div align="center">

### 📊 Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
*Översikt av alla projekt, formulärsvar, och AI-genererade dokument*

### 👤 Customer Dashboard
![Customer Dashboard](docs/screenshots/customer-dashboard.png)
*Kundens projektöversikt med timeline, möten, och dokument*

### 📝 Dynamic Project Form
![Project Form](docs/screenshots/project-form.png)
*Multi-step wizard med 55 frågor och spara-utkast funktionalitet*

### 🤖 RAG AI Chat
![RAG Chat](docs/screenshots/rag-chat.png)
*Intelligent chat med projektinsikt via vector search och streaming*

### 📅 Meeting Calendar
![Meeting Calendar](docs/screenshots/meeting-calendar.png)
*Google Calendar-liknande månadsvy med färgkodade möten*

### ⏱️ Project Timeline
![Timeline](docs/screenshots/timeline.png)
*Visuell tidslinje med milstolpar och progress tracking*

</div>

---

## ✨ Features

### 🔐 Authentication & Onboarding
- JWT-baserad autentisering med PBKDF2 password hashing
- Invitation-only registrering (kunder kan inte själv-registrera)
- Multi-step onboarding med företagsinformation
- Rollbaserad åtkomstkontroll (RBAC)

### 📝 Dynamic Project Forms
- **Hemsida-formulär:** 24 frågor i 8 sektioner
- **System-formulär:** 31 frågor i 9 sektioner
- Conditional fields, validering, file uploads
- Spara utkast och återuppta senare
- Sammanfattningsvy med edit-länkar

### 🤖 AI/RAG System
- **Automatisk dokumentgenerering:**
  - Project Specification
  - Technical Requirements
  - Design Brief
  - Budget & Timeline
- **Vector search** med pgvector (eller float[] fallback)
- **Streaming chat** med projektinsikt via SSE
- **Gemini 2.0 Flash** för textgenerering
- **text-embedding-004** för embeddings
- **Oban workers** för asynkrona jobb

### 📊 Project Management
- **ProductPlan:** State machine (draft → sent → viewed → approved/changes_requested)
- **Milestones:** Timeline med progress tracking
- **Meetings:** Full CRUD med state machine (scheduled → in_progress → completed)
- **Tickets:** Support-system med kommentarer och assignees
- **TimeEntries:** Tidsrapportering med hourly rate och billable-flagga

### 📁 File Management
- Google Drive-liknande interface
- Grid/List view toggle
- Sortering och filtrering
- Förhandsgranskning (PDF, bilder)
- Breadcrumb-navigering
- Kategori-baserad organisation

### 🌐 Internationalization
- Svenska (sv) - Default
- Engelska (en)
- Locale-filer: `locales/sv.json`, `locales/en.json`
- `useTranslation()` hook med `t('key.path')` syntax

---

## 🛠️ Tech Stack

### Frontend
```
React 18.2          - UI framework
TypeScript 5.3      - Type safety
Vite 5.0            - Build tool & dev server
TanStack Query      - Data fetching & caching
React Testing Lib   - Component testing
Vitest              - Test runner (300 tests)
Tailwind CSS        - Styling (via CDN)
Lucide React        - Icons
```

### Backend
```
Elixir 1.15         - Functional programming language
Phoenix 1.7         - Web framework
Ash Framework 3.0   - Resource-oriented framework
PostgreSQL 15       - Relational database
AshPostgres         - Postgres data layer for Ash
AshAuthentication   - JWT auth with PBKDF2
Oban 2.18           - Background job processing
Req 0.5             - HTTP client for Gemini API
```

### AI/RAG
```
Google Gemini       - LLM (gemini-2.0-flash-exp)
text-embedding-004  - Embeddings (768 dimensions)
pgvector (optional) - Vector similarity search
```

### DevOps
```
Docker              - Containerization
Fly.io              - Deployment platform
PowerShell          - Windows development scripts
Git                 - Version control
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ och npm
- **Elixir** 1.15+ och Erlang/OTP 26
- **PostgreSQL** 15+
- **Git**
- **PowerShell** (för Windows development)

### 1. Clone Repository

```bash
git clone https://github.com/Vulcora/siteflow-organic.git
cd siteflow-organic
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your Gemini API key to .env
GEMINI_API_KEY=your_api_key_here

# Start dev server (port 5173)
npm run dev
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
mix deps.get

# Create database
mix ecto.create

# Run migrations
mix ecto.migrate

# Seed database (optional)
mix run priv/repo/seeds.exs

# Start Phoenix server (port 3000)
mix phx.server
```

### 4. Backend Setup (Windows PowerShell)

```powershell
# All-in-one: Install deps, migrate, start server
.\restart_server.ps1

# Just run migrations
.\run_migrations.ps1

# Generate TypeScript types from Ash resources
.\gen_types.ps1

# Seed database
.\run_seeds.ps1

# Check users in database
.\check_users.ps1

# Run backend tests
.\test_backend.ps1
```

### 5. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000/api
- **Phoenix LiveDashboard:** http://localhost:3000/dev/dashboard

---

## 📐 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  Dashboards  │  │    Forms     │  │   AI Chat (SSE)      │  │
│  │  (6 roles)   │  │  (Dynamic)   │  │   Streaming          │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│         │                  │                      │              │
│         └──────────────────┴──────────────────────┘              │
│                            │                                     │
│                    ┌───────▼────────┐                           │
│                    │   useApi Hook   │  (RPC Calls)             │
│                    │  TanStack Query │                          │
│                    └───────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  HTTP/JSON API   │
                    │  (Phoenix)       │
                    └────────┬─────────┘
┌────────────────────────────┼──────────────────────────────────────┐
│                   Backend (Elixir/Phoenix)                        │
│  ┌─────────────────┐       │       ┌──────────────────────┐      │
│  │ Authentication  │◄──────┴──────►│   RPC Controller     │      │
│  │ (JWT + PBKDF2)  │               │   (AshTypescript)    │      │
│  └─────────────────┘               └──────────┬───────────┘      │
│                                               │                  │
│  ┌────────────────────────────────────────────▼──────────────┐  │
│  │              Ash Framework (3.0)                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  │
│  │  │ Accounts │  │  Portal  │  │   AI     │  │  Workers │  │  │
│  │  │  Domain  │  │  Domain  │  │ Services │  │  (Oban)  │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │  │
│  │       │              │              │             │        │  │
│  │       └──────────────┴──────────────┴─────────────┘        │  │
│  │                            │                                │  │
│  └────────────────────────────┼────────────────────────────────┘  │
│                               │                                   │
│  ┌────────────────────────────▼────────────────────────────────┐ │
│  │                     PostgreSQL 15                           │ │
│  │  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐│ │
│  │  │  Users  │  │ Projects │  │ Tickets  │  │  Embeddings  ││ │
│  │  │Companies│  │Documents │  │ Meetings │  │  (pgvector)  ││ │
│  │  └─────────┘  └──────────┘  └──────────┘  └──────────────┘│ │
│  └───────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────┘
                             │
                    ┌────────▼─────────┐
                    │  Google Gemini   │
                    │  (AI API)        │
                    └──────────────────┘
```

### Data Flow: Customer Onboarding

```
1. Admin skapar Invitation           →  Invitation.token genereras
2. Kund får email med länk           →  GET /api/onboarding/validate/:token
3. Kund fyller i företagsinfo        →  OnboardingPage.tsx (multi-step wizard)
4. Submit                             →  POST /api/onboarding/register
5. Backend skapar Company + User     →  register_via_invitation/3
6. Auto-login                         →  JWT token returneras
7. Redirect till Dashboard            →  CustomerDashboard.tsx
```

### Data Flow: AI Document Generation

```
1. Kund submits DynamicProjectForm   →  FormResponse.create (state: draft → submitted)
2. Backend triggar Oban worker        →  DocumentGenerationWorker.enqueue_all/2
3. Worker chunkar och embeddar text   →  EmbeddingService.embed_and_store/3
4. Worker genererar 4 dokument        →  DocumentGenerator.generate_all_documents/2
5. Gemini API: text-embedding-004     →  768-dimensionella vectors
6. Gemini API: gemini-2.0-flash       →  Structured documents (markdown)
7. Lagrar i GeneratedDocument         →  State: draft → published
8. Admin ser i RAGChatPanel           →  GET /api/rag/projects/:id/documents
9. Admin chattar med RAG              →  POST /api/rag/projects/:id/chat (SSE streaming)
```

---

## 📚 API Documentation

### Authentication Endpoints

```http
POST   /api/auth/register          # User registration (via invitation)
POST   /api/auth/sign-in           # Login (returns JWT)
DELETE /api/auth/sign-out          # Logout
```

### Onboarding Endpoints

```http
GET    /api/onboarding/validate/:token    # Validate invitation token
POST   /api/onboarding/register           # Register via invitation
```

### RPC Endpoints

```http
POST   /api/rpc/run                # Execute Ash RPC action
POST   /api/rpc/validate           # Validate RPC action
```

### RAG/AI Endpoints

```http
POST   /api/rag/projects/:id/chat                  # Streaming chat (SSE)
GET    /api/rag/projects/:id/chat/history          # Chat history
POST   /api/rag/projects/:id/generate-documents    # Generate all documents
POST   /api/rag/projects/:id/generate-document/:type  # Generate specific type
GET    /api/rag/projects/:id/documents             # Get generated documents
POST   /api/rag/projects/:id/embed                 # Trigger embeddings
```

### RPC Actions (Examples)

```typescript
// Product Plan
product_plan_by_project(projectId: string)
product_plan_create(projectId, title, content, pdfUrl)
product_plan_send_to_customer(id)
product_plan_approve(id)
product_plan_request_changes(id, changeRequests)

// Milestones
milestone_by_project(projectId: string)
milestone_create(projectId, title, description, dueDate)
milestone_mark_completed(id)
milestone_reopen(id)

// Meetings
meeting_by_project(projectId: string)
meeting_create(projectId, title, scheduledAt, meetingType, ...)
meeting_start(id)
meeting_complete(id, notes)
meeting_cancel(id)
```

---

## 🧪 Testing

### Frontend Tests

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm test

# Run with coverage
npm run test:coverage
```

**Test Stats:**
- ✅ 300 tests passing (100% pass rate)
- 📁 20 test files
- 🎯 Components: Dashboards, Forms, Shared, Timeline, Meetings
- 🔌 MSW for API mocking
- ⚛️ React Testing Library

### Backend Tests

```powershell
# Run all backend tests
.\test_backend.ps1

# Or with mix directly
cd backend
mix test
```

**Test Stats:**
- ✅ 24 backend tests passing
- 🧪 ChatMessage, GeneratedDocument, ManualKnowledgeEntry
- 🔒 Policy expression tests
- 📊 State machine tests

---

## 📂 Project Structure

```
siteflow-organic/
├── backend/                          # Elixir/Phoenix backend
│   ├── lib/
│   │   ├── backend/
│   │   │   ├── accounts/             # User, Token resources
│   │   │   │   └── onboarding_service.ex
│   │   │   ├── portal/               # Portal domain
│   │   │   │   ├── project.ex
│   │   │   │   ├── ticket.ex
│   │   │   │   ├── meeting.ex
│   │   │   │   ├── milestone.ex
│   │   │   │   └── product_plan.ex
│   │   │   ├── ai/                   # AI/RAG services
│   │   │   │   ├── gemini_client.ex
│   │   │   │   ├── embedding_service.ex
│   │   │   │   ├── document_generator.ex
│   │   │   │   └── rag_service.ex
│   │   │   └── workers/              # Oban workers
│   │   │       ├── document_generation_worker.ex
│   │   │       └── embedding_worker.ex
│   │   └── backend_web/
│   │       ├── controllers/
│   │       │   ├── onboarding_controller.ex
│   │       │   └── rag_controller.ex
│   │       └── router.ex
│   ├── priv/repo/migrations/         # Database migrations
│   ├── test/                         # Backend tests
│   └── mix.exs                       # Dependencies
│
├── components/                       # React components
│   ├── dashboards/                   # Role-based dashboards
│   │   ├── AdminDashboard.tsx
│   │   ├── CustomerDashboard.tsx
│   │   ├── DeveloperDashboard.tsx
│   │   ├── KAMDashboard.tsx
│   │   ├── ProjectLeaderDashboard.tsx
│   │   └── TimeTrackingDashboard.tsx
│   ├── forms/                        # Form components
│   │   ├── CreateProjectForm.tsx
│   │   ├── CreateTicketForm.tsx
│   │   ├── DynamicProjectForm.tsx
│   │   └── ...
│   ├── shared/                       # Reusable components
│   │   ├── Modal.tsx
│   │   ├── ProjectSelector.tsx
│   │   └── DocumentList.tsx
│   ├── timeline/
│   │   └── ProjectTimeline.tsx       # Visual timeline
│   ├── meetings/
│   │   └── ProjectMeetings.tsx       # Calendar view
│   ├── rag/
│   │   ├── RAGChatPanel.tsx          # AI chat
│   │   └── GeneratedDocuments.tsx
│   ├── productplan/
│   │   ├── ProductPlanManagement.tsx
│   │   └── ProductPlanCustomerView.tsx
│   ├── admin/
│   │   ├── AdminFormResponseView.tsx
│   │   └── AdminFileBrowser.tsx
│   └── ProjectOverview.tsx
│
├── src/
│   ├── components/                   # Test files for components
│   ├── config/
│   │   └── formSchema.ts             # Dynamic form schemas
│   ├── context/
│   │   └── AuthContext.tsx           # Authentication context
│   ├── hooks/
│   │   ├── useApi.ts                 # RPC hook (50+ actions)
│   │   ├── useRAGChat.ts             # SSE streaming chat
│   │   └── useFormResponses.ts
│   ├── generated/
│   │   └── ash-rpc.ts                # Generated TypeScript types
│   └── test/
│       └── setup.ts                  # MSW handlers
│
├── locales/
│   ├── sv.json                       # Swedish translations
│   └── en.json                       # English translations
│
├── docs/
│   ├── implementation-status.md      # Current implementation status
│   ├── next-steps-plan.md            # Detailed roadmap
│   ├── ash-typescript-integration-guide.md
│   └── state_machine_architecture.md
│
├── *.ps1                             # PowerShell development scripts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔧 Development Scripts (PowerShell)

```powershell
# Backend
.\restart_server.ps1           # Start Phoenix server
.\gen_types.ps1                # Generate TypeScript types from Ash
.\run_migrations.ps1           # Run database migrations
.\migrate_and_restart.ps1      # Migrate + restart
.\run_seeds.ps1                # Seed database
.\check_users.ps1              # Check users in DB
.\test_backend.ps1             # Run backend tests
.\test-rpc.ps1                 # Test RPC endpoints

# Testing
.\run_all_tests.ps1            # Run all tests (frontend + backend)

# Tidewave MCP
.\test_tidewave.ps1            # Test Tidewave integration
.\test_eval_code.ps1           # Evaluate code with Tidewave
.\test_get_schemas.ps1         # Get database schemas
.\test_sql_query.ps1           # Execute SQL queries
```

---

## 🚢 Deployment

### Fly.io Deployment

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly deploy

# Check status
fly status

# View logs
fly logs
```

### Environment Variables

**Frontend (.env):**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Backend (config/runtime.exs):**
```elixir
config :backend, Backend.Repo,
  url: System.get_env("DATABASE_URL")

config :backend, BackendWeb.Endpoint,
  secret_key_base: System.get_env("SECRET_KEY_BASE")
```

---

## 👥 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `siteflow_admin` | System administrator | Full access to everything |
| `siteflow_kam` | Key Account Manager | Manage customer relationships |
| `siteflow_pl` | Project Leader | Manage projects and teams |
| `siteflow_dev_frontend` | Frontend Developer | Work on frontend tickets |
| `siteflow_dev_backend` | Backend Developer | Work on backend tickets |
| `siteflow_dev_fullstack` | Fullstack Developer | Work on all tickets |
| `customer` | Customer user | View own projects, submit tickets |
| `partner` | Partner user | Limited access to shared projects |

---

## 📝 Key Workflows

### 1. Customer Onboarding
1. Admin creates `Invitation` via `InviteUserForm.tsx`
2. Customer receives email with token link
3. Customer completes `OnboardingPage.tsx` (multi-step wizard)
4. Backend creates `Company` + `User` via `OnboardingService`
5. Auto-login → `CustomerDashboard.tsx`

### 2. Project Request
1. Customer fills `DynamicProjectForm.tsx` (55 questions)
2. `FormResponse` created with state: `draft` → `submitted`
3. Admin views in `AdminFormResponseView.tsx`
4. Admin creates `ProductPlan` via `ProductPlanManagement.tsx`
5. State machine: `draft` → `sent` → `viewed` → `approved`

### 3. AI Document Generation
1. `FormResponse` submitted
2. Oban worker: `DocumentGenerationWorker.enqueue_all/2`
3. Gemini API generates 4 documents (spec, requirements, design, timeline)
4. Vector embeddings created via `text-embedding-004`
5. Admin chats with RAG via `RAGChatPanel.tsx`

### 4. Project Execution
1. Timeline managed via `ProjectTimeline.tsx` (milestones)
2. Meetings scheduled via `ProjectMeetings.tsx` (calendar)
3. Tickets created for features/bugs
4. Developers log time via `CreateTimeEntryForm.tsx`
5. Documents shared via `DocumentList.tsx`

---

## 🤝 Contributing

**This is a proprietary project.** Contributions are currently limited to authorized team members.

### Development Workflow

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test: `npm run test:run` + `.\test_backend.ps1`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Create Pull Request

### Code Style

- **Frontend:** TypeScript strict mode, React functional components, Tailwind CSS
- **Backend:** Elixir formatter (`mix format`), Credo linting
- **Tests:** Vitest (frontend), ExUnit (backend)

---

## 📄 License

**Proprietary** - All rights reserved. This software is the property of Siteflow and may not be copied, distributed, or modified without explicit permission.

---

## 🙏 Acknowledgments

- **Ash Framework** - Elegant resource-oriented framework for Elixir
- **Phoenix Framework** - Productive web framework for Elixir
- **React** - UI library for building interfaces
- **Google Gemini** - AI models for embeddings and generation
- **TanStack Query** - Powerful data synchronization for React
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

For questions, issues, or feature requests:

- **Email:** support@siteflow.se
- **GitHub Issues:** [Create an issue](https://github.com/Vulcora/siteflow-organic/issues)
- **Documentation:** [docs/](docs/)

---

<div align="center">

**Made with ❤️ by the Siteflow Team**

[![Powered by Elixir](https://img.shields.io/badge/Powered%20by-Elixir-purple?logo=elixir)](https://elixir-lang.org/)
[![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb?logo=react)](https://reactjs.org/)
[![AI by Gemini](https://img.shields.io/badge/AI%20by-Gemini-4285F4?logo=google)](https://ai.google.dev/)

[⬆ Back to top](#-siteflow-customer-portal)

</div>
