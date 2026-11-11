# Passline — rules for Claude

Source of truth for what we build: `docs/PROJECT-BRIEF.md`. Product facts: `PRODUCT.md`. Visual system: `DESIGN.md`.

## Rule: research and design before every feature

Every feature, without exception, starts with `/design-feature <feature>`, before any code:

1. **Research first.** Search the web for how senior engineers and architects build this kind of feature: official docs, engineering blogs from teams that run it in production, known pitfalls. Cite the sources.
2. **Design the code and the schema** to engineering best practice:
   - SOLID, clear module boundaries, dependency direction
   - a normalized schema with constraints, indexes and RLS
   - typed contracts with Zod
   - error handling, security, observability, testing and cost
3. **Present the design and wait for approval.** No code until Amir says "go ahead".
4. **Build it as one small PR**, then check it against the design's checklist.

Best practice includes **not over-engineering**. Apply SOLID where it reduces real coupling or real duplication. Never add an abstraction for something used once. If a principle and simplicity conflict, say so and recommend one.

## Rule: document every feature in the same PR

After building a feature and before opening its PR, run `/document-feature`:

- **Module README** (`lib/<module>/README.md`): purpose, a **Mermaid flow diagram**, public API, tables, errors and limits, cost, tests. Required in every feature PR.
- **`docs/architecture.md`**: system map (C4 levels 1–2 in Mermaid). Updated when the system shape changes.
- **ADR** (`docs/adr/NNNN-title.md`, Nygard format): only for significant decisions. Never edit an old one; supersede it with a new ADR.

A PR that changes behaviour without updating its docs is not done.

## Rule: industry-ready core

Restaurants are the only vertical for now. Build the engine so another industry (medical next) can reuse it through a switcher:

- **Generic names** in code, schema and APIs: `contacts` (not guests), `bookings` + `resources` (not tables), `handoffs.reason`. Restaurant words appear only in the vertical config.
- **Vertical config is data:** UI labels, safety rules, document types and the eval set per vertical (`tenants.vertical`). Never write `if (vertical === "restaurant")` branches in business logic.
- Industry-only fields go in a validated `attributes jsonb`, with one Zod schema per vertical.
- **Don't build medical yet**: no medical code, screens or rules until Amir starts it.

## Frontend stack

Tailwind CSS v4 + shadcn/ui. Design tokens from `DESIGN.md` are defined as CSS variables and mapped into the Tailwind theme. Use shadcn components (Sheet, Popover, Tabs, Collapsible, Alert, Textarea) before writing custom ones.

## Standing project rules (from the brief)

- Fictional data only. Never use real business or people names. The only names are Passline (product), Thymewick (demo restaurant) and Saltquay (second tenant).
- Validate every model output with Zod. The server decides what actions are allowed, never the model.
- Log every AI call: model, tokens, cost, latency, request id.
- Multi-tenant from day one: `tenant_id` + Postgres row-level security on every business table.
- Public demo limits: $1 per day maximum for the whole app. Claude: 1 question per visitor per day. Free models: 20 questions per visitor per hour.
- No `console.log` in app code, no commented-out code, no empty catch blocks, meaningful names.
- Run `npm run typecheck`, `npm test` and `npm run eval` before every PR.
- Conventional commits. One branch + PR per feature, squash-merged to `main`.

## Rule: commit messages

**Subject:** `type(scope): what changes, as an outcome`. Lowercase, no full stop, and the squash merge adds `(#N)`.
- Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `ci`.
- Scopes: `mcp`, `data`, `web`, `rag`, `db`, `ai`, `evals`, `ci`, `repo`, `docs`.
- Prefer the new behaviour over "add X": `feat(mcp): check_allergens never says a dish is safe`.

**Body:** short prose paragraphs wrapped at about 72 characters.
1. **Why:** the problem, with a concrete example or numbers when there is one.
2. **What changed:** the behaviour and the key decisions, not a file list.
3. **Edge cases / limits** worth knowing.
4. `Tested:` one line on how it was proven (cases, tools, clients).
5. `Follow-up:` anything deliberately left for later.

Use bullets only when listing parts (screens, tools). End with the Claude `Co-Authored-By` trailer only.

**Never** put a work email, an employer name or any private project name in a commit. Commits are authored as `Amir Gad <Amir1887@users.noreply.github.com>`.

## Rule: merging PRs

Merge only after the CI checks have **actually run and passed**. "No checks reported" or "queued" means wait, not merge. Squash-merge, delete the branch, sync `main`, then switch `gh` back to `amir-hwood`.
