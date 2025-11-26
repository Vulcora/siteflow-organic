# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Siteflow consists of two main components:
1. **Marketing Website** - Swedish-language React/Vite SPA for the digital systems consultancy
2. **Customer Portal Backend** - Elixir/Phoenix API with Ash Framework for the B2B SaaS customer portal

## Commands

### Frontend (React/Vite)
```bash
npm run dev          # Start Vite dev server (localhost:5173) with API proxy
npm run build        # Create production build to dist/
npm run server       # Start Express backend for Gemini AI (requires dist/)
npm start            # Build + start production server
npm test             # Run Vitest tests in watch mode
npm run test:run     # Run Vitest tests once
npm run test:coverage # Run tests with coverage report
```

### Backend (Elixir/Phoenix) - Use PowerShell scripts on Windows
```powershell
.\restart_server.ps1       # Start Phoenix server (localhost:3000)
.\gen_types.ps1            # Generate TypeScript types from Ash resources
.\run_migrations.ps1       # Run database migrations
.\migrate_and_restart.ps1  # Run migrations and restart server
.\run_seeds.ps1            # Seed database with sample data
.\check_users.ps1          # Check users in database
.\test_backend.ps1         # Run backend tests
.\test-rpc.ps1             # Test RPC endpoints
```

Or with mix directly (requires PATH setup):
```bash
cd backend
mix phx.server             # Start server
mix ash_typescript.codegen # Generate TypeScript RPC types
mix ecto.migrate           # Run migrations
mix run priv/repo/seeds.exs # Run seeds
mix test                   # Run tests
```

## Architecture

### Frontend (React SPA)
- **Entry:** `index.tsx` → `App.tsx`
- **Routing:** Custom client-side routing via `setCurrentPage` state (no react-router)
- **Pages:** Defined in `types.ts` - home, philosophy, audience, results, contact, login, blog, blogPost, caseStudies, caseStudy, privacy, terms, notFound, dashboard
- **Styling:** Tailwind CSS via CDN, custom animations in `index.html` head
- **Components:**
  - `components/` - Page components (lazy-loaded) and UI components
  - `components/dashboards/` - Role-specific dashboard views (Admin, Customer, Developer, KAM, ProjectLeader, TimeTracking)
  - `components/forms/` - Form components (CreateProject, CreateTicket, CreateTimeEntry, InviteUser, UploadDocument)
  - `components/shared/` - Reusable UI components (Modal, DocumentList)
- **Source Organization:**
  - `src/components/` - Test files for components
  - `src/context/` - React contexts (AuthContext for authentication)
  - `src/hooks/` - Custom hooks (useApi for RPC calls)
  - `src/generated/` - Generated TypeScript types from Ash backend
  - `src/test/` - Test setup and utilities
- **Testing:** Vitest with React Testing Library, jsdom environment, tests in `src/**/*.test.{ts,tsx}`

### Backend - Express (server/)
- **Server:** `server/index.js` (ES Modules)
- **API:** `POST /api/assess-system-needs` - Gemini AI customer fit analysis
- **Static serving:** Express serves `dist/` in production with SPA fallback

### Backend - Elixir/Phoenix (backend/)
- **Framework:** Phoenix 1.8 with Ash Framework 3.x
- **Database:** PostgreSQL via Ecto/AshPostgres
- **Auth:** AshAuthentication with JWT tokens, PBKDF2 password hashing (Windows-compatible)

**Ash Domains:**
- `Backend.Accounts` - User authentication (User, Token resources)
- `Backend.Portal` - Customer portal (Company, Project, Ticket, Comment, TimeEntry, Document, Invitation)

**User Roles:**
- `siteflow_admin` - Full system access
- `siteflow_kam` - Key Account Manager
- `siteflow_pl` - Project Leader
- `siteflow_dev_frontend`, `siteflow_dev_backend`, `siteflow_dev_fullstack` - Developer roles
- `customer` - Customer user
- `partner` - Partner user

**API Routes (backend/lib/backend_web/router.ex):**
- **Public:**
  - `GET /api/health` - Health check
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/sign-in` - User login (returns JWT)
  - `DELETE /api/auth/sign-out` - User logout
- **Protected (requires Bearer token):**
  - `POST /api/rpc/run` - Execute Ash RPC action
  - `POST /api/rpc/validate` - Validate Ash RPC action
  - `/api/accounts/*` - Accounts domain JSON API
  - `/api/portal/*` - Portal domain JSON API
- **Development:**
  - `/dev/dashboard` - Phoenix LiveDashboard

**TypeScript RPC Integration:**
- AshTypescript generates RPC types to `siteflow-public/src/generated/ash-rpc.ts`
- Frontend uses `useApi` hook from `src/hooks/useApi.ts` to call RPC actions
- RPC actions configured with `typescript_rpc?` in resource definitions
- Configure RPC actions in domain files (e.g., `backend/lib/backend/portal/portal.ex`)

### i18n System
- Languages: Swedish (sv, default) and English (en)
- Config: `src/i18n.ts`
- Translations: `locales/sv.json` and `locales/en.json`
- Usage: `useTranslation()` hook with `t('key.path')` syntax
- **Important:** When adding UI text, update both locale files

## Key Conventions

### General
- All UI text must use i18n translations, not hardcoded strings (update both `locales/sv.json` and `locales/en.json`)
- CORS is configured in `backend/lib/backend_web/plugs/cors.ex`

### Frontend
- **Pages:** Update `Page` type in `types.ts`, add route in `App.tsx`, create component in `components/`
- **Authentication:** Use `AuthContext` via `useAuth()` hook - provides `user`, `token`, `isAuthenticated`, `login`, `logout`, `getAuthHeaders`
- **API calls:** Use `useApi` hook from `src/hooks/useApi.ts` for RPC calls with automatic auth headers
- **Dashboards:** Role-specific dashboards in `components/dashboards/` - rendered based on user role
- **Forms:** Reusable form components in `components/forms/` for creating resources
- **Testing:** Tests in `src/` directory, colocated with source files

### Backend
- **Resources:** Add to appropriate domain, create migration, regenerate TypeScript types with `.\gen_types.ps1`
- **Auth API format:** Wrap credentials in `user` key - `{ "user": { "email": "...", "password": "..." } }`
- **RPC actions:** Mark actions with `typescript_rpc? true` in resource definitions to expose via RPC
- **Migrations:** After creating, run `.\migrate_and_restart.ps1` to apply and restart server
- **Seeds:** Use `backend/priv/repo/seeds.exs` for sample data, run with `.\run_seeds.ps1`

## Role-Based Dashboard System

The customer portal uses a role-based dashboard system:
- **DashboardLayout.tsx** - Main layout wrapper with navigation, handles role-based routing
- **DashboardPage.tsx** - Entry point that renders appropriate dashboard based on user role
- **Dashboard Components:**
  - `AdminDashboard` - Full system overview, user management
  - `CustomerDashboard` - Customer project view, tickets, documents
  - `DeveloperDashboard` - Assigned tickets, time tracking
  - `KAMDashboard` - Key account manager view, customer overview
  - `ProjectLeaderDashboard` - Project management, team overview
  - `TimeTrackingDashboard` - Time entry management

Each dashboard component is responsible for fetching its own data using the `useApi` hook.

## Environment

- **Frontend `.env`:** `GEMINI_API_KEY` (see `.env.example`)
- **Backend config:** `backend/config/dev.exs` for database and server settings
- **Development:** Vite dev server (port 5173) proxies `/api` requests to Phoenix backend (port 3000)
- **Production:** Express serves built files from `dist/` and proxies API requests
- **Deployment:** Fly.io via Docker (see `fly.toml`, `Dockerfile`)
