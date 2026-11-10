# 0002. Structured tenant data files as the single source of truth

Date: 2026-11-10 · Status: Accepted

## Context

Phase 0 (MCP server) needs restaurant facts — hours, menu, allergens, tables — with no database. Phase 1 (knowledge desk) answers from documents through RAG. If the MCP tools and the RAG documents were written separately, they could disagree (for example, different Friday hours), and the demo would contradict itself. The data is also safety-relevant (allergens), so mistakes must be caught early.

## Decision

- Keep each tenant's facts as structured JSON in `data/<tenant>/` (`restaurant.json`, `hours.json`, `availability.json`, `menu.json`) plus a floor-plan SVG.
- Validate every file with Zod at startup, including cross-file rules (bookings point to real tables, dishes use known allergens, max party size fits a table). Invalid data stops the server with the file and field named.
- Split files into **core** (any business) and **kit** (one vertical, chosen by `restaurant.json` → `vertical`).
- Pre-render the floor plan to PNG with a script and commit it.
- Phase 1 will **generate** the Markdown/PDF documents for RAG from these files, not write them by hand.

## Alternatives considered

- **Markdown documents as the source, parsed for the MCP tools:** rejected; parsing prose for exact hours and allergens is fragile, and safety facts need a strict shape.
- **Database (Supabase) from day one:** rejected for Phase 0; it adds hosting and credentials before anything needs them. The JSON shape maps cleanly to tables later.
- **YAML instead of JSON:** nicer to hand-edit, but adds a parser dependency and has type-coercion surprises. JSON plus Zod is enough.
- **Render the PNG at runtime:** rejected; it would ship a native renderer to every user, and outputs could differ by machine.

## Consequences

- Easier: one place to change a fact; deterministic tests and demo videos; safety rules are enforced by schema.
- Harder: editing the SVG requires re-running `npm run render:floor-plan`; a test checks that every table is drawn.
- Follow-up: in Phase 1, add a generator for the RAG documents and move the schemas to `packages/core` once the web app also reads them.
