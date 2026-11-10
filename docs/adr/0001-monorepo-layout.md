# 0001. Monorepo layout with npm workspaces

Date: 2026-11-10 · Status: Accepted

## Context

Passline will contain a stdio MCP server (Phase 0), a Next.js web app with UI and API (Phase 1), a Supabase database, and shared domain logic (opening hours, availability, menu) that both the server and the app need. It must stay simple for one developer, and ready to add more apps and, later, other industries.

## Decision

- One repository using **npm workspaces**: `apps/*` for runnable apps, `packages/*` for reusable code.
- The Next.js app is both front end and back end (pages + API routes). There are no separate `fe/` and `be/` folders.
- One **`supabase/`** folder at the repo root for migrations, seed data and config, because the Supabase CLI expects a single project directory.
- Fictional source data lives in **`data/<tenant>/`** and is the single source of truth for MCP tools and RAG documents.
- Code moves into `packages/` **only when a second app uses it**.
- Shared TypeScript settings live in `tsconfig.base.json`. Each package pins exact dependency versions.

## Alternatives considered

- **Turborepo + pnpm:** a common choice for large monorepos, with task caching. Rejected for now: 1–3 packages don't need it, and it can be added later without moving folders.
- **A single Next.js app holding everything (including the MCP server):** rejected, because the MCP server must ship as its own npm package (`passline-mcp`) that runs without the web app.
- **Separate `frontend/`, `backend/` and `db/` repos or folders:** rejected; Next.js already joins UI and API, and splitting would duplicate types and contracts.
- **Migrations inside `apps/web/supabase/`:** possible, but the database is shared infrastructure, not owned by one app.

## Consequences

- Easier: one install, one CI workflow, shared types, atomic PRs across packages.
- Harder: workspace-aware commands (`npm run <script> -w <package>`).
- Follow-up: extract `packages/core` in Phase 1 when the web app needs the same domain logic as the MCP server; add `packages/db` with the first migration.
