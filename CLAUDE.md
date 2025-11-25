# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Siteflow Organic is a Swedish-language marketing website for a digital systems consultancy. It's a React/Vite SPA with an Express backend that integrates with Google's Gemini AI for customer fit analysis.

## Commands

```bash
npm run dev      # Start Vite dev server (localhost:3000)
npm run build    # Create production build to dist/
npm run server   # Start Express backend (requires dist/)
npm start        # Build + start production server
```

## Architecture

### Frontend (React SPA)
- **Entry:** `index.tsx` → `App.tsx`
- **Routing:** Custom client-side routing via `setCurrentPage` state (no react-router)
- **Pages:** home, philosophy, audience, results, contact, login (defined in `types.ts`)
- **Styling:** Tailwind CSS via CDN (not build tool), custom animations in `index.html` head

### Backend (Express)
- **Server:** `server/index.js` (ES Modules)
- **API:** `POST /api/assess-system-needs` - AI-powered customer fit analysis
- **Static serving:** Express serves `dist/` in production with SPA fallback

### i18n System
- Languages: Swedish (sv, default) and English (en)
- Config: `src/i18n.ts`
- Translations: `locales/sv.json` and `locales/en.json`
- Usage: `useTranslation()` hook with `t('key.path')` syntax
- **Important:** When adding UI text, update both locale files

### AI Integration
- Service: `services/geminiService.ts`
- Model: Gemini 2.5 Flash
- API key stored server-side only (never in frontend)
- Response format: `{ fitScore: number, analysis: string }`

## Key Conventions

- All UI text must use i18n translations, not hardcoded strings
- New pages require: updating `Page` type in `types.ts`, adding to `App.tsx` router, creating component
- Environment: `.env` with `GEMINI_API_KEY` (see `.env.example`)
- Deployment: Fly.io via Docker (see `fly.toml`, `Dockerfile`)
