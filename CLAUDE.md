# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

Nature Blog (表里世界) is a Next.js 16 blog with Notion as headless CMS, featuring a three-screen immersive experience combining Song Dynasty aesthetics with Swiss design.

### Tech Stack
- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Notion API (@notionhq/client) for content
- ISR with 1-hour revalidation + client-side version detection
- CSS Modules for styling

### Key Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/screens/` - Three-screen components (SurfaceScreen, InnerScreen, GroundScreen)
- `src/services/notion/` - Notion API integration and Markdown conversion
- `src/contexts/LanguageContext.tsx` - Global language state (zh/en) with localStorage persistence
- `src/lib/seo/` - JSON-LD schemas, hreflang, metadata generation
- `src/lib/feed/` - RSS/Atom/JSON feed generation
- `src/config/theme.ts` - Design system (colors, fonts, spacing)

### Data Flow
```
Notion Database → getArticles()/getArticleById() → Markdown conversion → React components → ISR cached pages
```

### Multi-Language Pattern
- `LanguageContext` provides `language` (zh/en) and `t(zh, en)` helper
- Articles linked via `relatedArticleId` property in Notion
- hreflang tags generated in `src/lib/seo/i18n.ts`

### Environment Variables
```env
NOTION_TOKEN=secret_xxxxx          # Required
NOTION_DATABASE_ID=xxxxx           # Required
REVALIDATE_SECRET=your-secret      # For manual ISR trigger
```

### ISR & Version Detection
- Pages revalidate every 3600 seconds
- `/api/version` endpoint for client-side version checking
- `useVersionCheck` hook triggers refresh on version change
