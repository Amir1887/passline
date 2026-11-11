# 0005. The public page reads its tool list from the server package

Date: 2026-11-11 · Status: Accepted

## Context

Passline needs a public link for Upwork clients: what it is, the MCP server's tools, how to install it, and proof that it works. The tool list and descriptions already live in the server's code, and they will change as tools are added (Phase 6 adds booking tools). A page whose tool list is typed by hand would drift from what the AI actually sees, which defeats the point of showing it. The page must also cost nothing and be safe to leave online.

## Decision

- `apps/web` is a **static** Next.js page (App Router, prerendered at build). It has no API routes, database, keys or AI calls.
- `passline-mcp` exports a small, public `passline-mcp/tools` entry: `toolCatalog()` returns each tool's name, title, model-facing description, kit and read-only flag, built from the same lists the server registers.
- The page imports it **at build time** and shows each tool's first description line and its "Use when" line. A test checks that the page's cards match the server's tools.
- Images (floor plan, Claude Code screenshot) keep one source in the repo and are copied into the site at build time.
- Hosting: Vercel with Root Directory `apps/web`.
- No shadcn components until there's more than one control; plain Tailwind with the `DESIGN.md` tokens.

## Alternatives considered

- **Hand-written tool list on the page:** simplest, but drifts from the code. Rejected.
- **Call the MCP server at runtime from the page:** shows live data, but needs a server process, a transport and abuse limits for a static marketing page. Rejected for now. Phase 6's remote server could power a live demo later.
- **Parse the server README:** fragile, and the README is prose meant for people, not a data source.
- **shadcn from day one:** adds a component system for one button; deferred to the Phase 1 app.

## Consequences

- Easier: the page is always accurate; no runtime cost or risk; every PR gets a preview URL on Vercel.
- Harder: the web build depends on building `passline-mcp` first (handled by `prebuild` / `predev`), and `passline-mcp` now has a public `./tools` export to keep stable.
- Follow-up: Phase 1 grows `apps/web` into the knowledge desk app, adding shadcn and the database.
