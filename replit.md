# replit.md

## Overview

This is a **gaming dashboard / game portal** web application built with a React frontend and Express backend. The app presents a futuristic-themed single-page dashboard interface where users can browse and play a large collection of browser-based games (HTML5, Unity WebGL, Flash via Ruffle, etc.). Games are served as static HTML files from the `client/public/g/` directory. The backend uses PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, bundled via Vite
- **Styling**: Tailwind CSS with a custom dark "Deep Blue / Shadow" theme using CSS variables
- **UI Components**: shadcn/ui (new-york style) with Radix UI primitives
- **State Management**: TanStack React Query for server state
- **Fonts**: Orbitron (futuristic display headings) + Inter (body text)
- **Layout**: Single-page dashboard with tab navigation (Home, Gaming, Browser, App, More) — all client-side routing via internal state, no React Router
- **Animations**: framer-motion for smooth transitions
- **Background**: Custom Canvas-based particle system (no external dependency)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`
- **Entry point**: `client/src/main.tsx` → `App.tsx` → `Dashboard` page

### Backend
- **Framework**: Express.js running on Node with TypeScript (via tsx)
- **HTTP Server**: Node's built-in `http.createServer` wrapping Express
- **API Pattern**: RESTful routes defined in `server/routes.ts`, with shared route/schema definitions in `shared/routes.ts`
- **Storage Layer**: `server/storage.ts` implements `IStorage` interface backed by `DatabaseStorage` class using Drizzle ORM — this abstraction allows swapping implementations
- **Validation**: Zod schemas (generated from Drizzle schemas via `drizzle-zod`) for input validation on API routes
- **Static serving**: In production, built client assets served from `dist/public`; in development, Vite dev server with HMR

### Database
- **Database**: PostgreSQL (required, via `DATABASE_URL` environment variable)
- **ORM**: Drizzle ORM with `drizzle-orm/node-postgres` driver
- **Schema**: Defined in `shared/schema.ts` — currently a simple `users` table with `id`, `username`, `password`
- **Migrations**: Managed via `drizzle-kit push` (schema push approach, not migration files)
- **Connection**: Uses `pg.Pool` in `server/db.ts`

### Shared Code
- `shared/schema.ts` — Database table definitions + Zod schemas + TypeScript types
- `shared/routes.ts` — API route definitions with paths, methods, input/output schemas (acts as a contract between frontend and backend)

### Build & Deployment
- **Dev**: `tsx server/index.ts` runs the server with Vite middleware for HMR
- **Build**: Custom `script/build.ts` — builds client with Vite, bundles server with esbuild into `dist/index.cjs`
- **Production**: `node dist/index.cjs` serves both API and static files
- **Vercel**: Configured via `vercel.json` with serverless function entry at `api/index.ts`, all routes rewritten to the API handler

### Game Content
- Games are static HTML files in `client/public/g/` — they load external assets from CDNs (jsdelivr, githack, etc.)
- Games include Unity WebGL ports, HTML5 games, Flash games (via Ruffle.js emulator), and iframe-embedded games
- No server-side logic for games; they're purely client-side static content

## External Dependencies

### Required Services
- **PostgreSQL**: Database (connection via `DATABASE_URL` environment variable) — must be provisioned
- **Google Fonts**: Orbitron, Inter, DM Sans, Fira Code, Geist Mono, Architects Daughter

### Key NPM Packages
- **Frontend**: React 18, TanStack React Query, Radix UI components, shadcn/ui, framer-motion, Tailwind CSS, class-variance-authority, cmdk, embla-carousel-react, date-fns
- **Backend**: Express, drizzle-orm, pg (node-postgres), connect-pg-simple, express-session, zod, drizzle-zod
- **Build**: Vite, esbuild, tsx, TypeScript, @replit/vite-plugin-runtime-error-modal

### CDN Dependencies (Game Content)
- Games load assets from `cdn.jsdelivr.net`, `rawcdn.githack.com`, and various external game CDNs
- Ruffle.js (Flash emulator) loaded from CDN for Flash-based games
- Unity WebGL loader scripts from various CDN sources