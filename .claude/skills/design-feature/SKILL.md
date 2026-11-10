---
name: design-feature
description: Research how senior engineers and architects build a feature, then design its code and database schema to best practice (SOLID, clean boundaries, constraints, RLS, Zod contracts, tests) and present it for approval before any code. Use at the start of every new feature, phase or PR in Passline, or when the user says "design", "plan this feature" or "how should we build X".
---

# Design a feature before building it

Goal: every feature in Passline is designed the way a senior engineer or architect would design it, backed by research, and approved before any code is written.

The input is a feature name or description, for example "hybrid retrieval" or "Stripe deposit webhooks".

## Step 1: Read the context (no web yet)

- `docs/PROJECT-BRIEF.md`: the phase this feature belongs to, and its definition of done
- `PRODUCT.md`: product facts, limits and decisions
- `DESIGN.md`: for any UI part
- The existing code and `supabase/migrations/`: what is already there, and the naming and folder conventions

Write down in one line what the feature must do, and which existing modules it touches.

## Step 2: Research on the web

Run 3–5 searches in one batch, covering:

| Search for | Example query |
|---|---|
| The official way | "<library/service> official docs <feature> best practice" |
| How production teams build it | "how <company> built <feature> architecture", "<feature> engineering blog" |
| Schema / data model | "<feature> database schema design postgres" |
| Known pitfalls | "<feature> common mistakes", "<feature> security pitfalls" |
| Recent changes | "<library> <current year> changes", deprecations, new versions |

Rules:
- Prefer primary sources (official docs, the vendor's engineering blogs) over SEO listicles. Say when a claim comes only from a weak source.
- Verify current versions and model names. Never rely on memory for them.
- Keep the source links for the design doc.

## Step 3: Design the code

Cover each of these, briefly:

| Area | What to decide |
|---|---|
| Modules | Files and functions, with one responsibility each (S). Where each lives in `lib/…` / `app/…` |
| Boundaries | What depends on what. Domain logic never imports framework or vendor SDKs directly; it goes through a small interface when there is more than one real implementation (D, O) |
| Interfaces | Only where there are 2+ real implementations or a real test seam (I). Example: `lib/ai/llm.ts` has Gemini, Groq and Claude, so an interface is justified |
| Contracts | Zod schemas for every API input, every model output and every external webhook |
| Errors | What can fail, how it is shown to the user, what is retried, and what is logged. No empty catch blocks |
| Security | Auth, RLS, rate limits, budget caps, secrets in env vars, input validation, prompt-injection exposure |
| Observability | What is logged: every AI call goes to `llm_calls` with model, tokens, cost, latency and request id |
| Cost | Cost per request and how it fits the $1/day app cap |
| Tests | Unit tests for pure logic, integration tests for DB/API, and eval cases if AI output is involved |

SOLID check, one line each:
- **S:** each module has one reason to change
- **O:** new providers or variants are added without editing existing ones
- **L:** every implementation of an interface is a true drop-in
- **I:** no interface forces callers to depend on methods they don't use
- **D:** high-level logic depends on interfaces, not on vendor SDKs

**Guardrail against over-engineering:** an abstraction must earn its place by real reuse, a real second implementation, or a real test seam. If not, use a plain function. Say explicitly where you chose simplicity over a principle.

## Step 4: Design the schema (if the feature stores data)

- Tables, columns and types. Every business table has `tenant_id uuid not null`
- Primary keys, foreign keys with on-delete behaviour, `not null`, `check` and `unique` constraints
- Indexes, each tied to the query it serves, including pgvector / full-text indexes where relevant
- Row-level security policies for every table, with the exact policy SQL
- Idempotency keys for anything triggered by webhooks or retries
- `created_at` / `updated_at`; soft delete only if there is a real need
- Migration plan: one forward migration file, safe to run on a populated database

Show it as SQL plus a small table diagram.

## Step 5: Present and wait

Present to Amir, following his response style: plain language, short, tables and ASCII diagrams, an analogy when a concept is new.

1. What the feature does, in one paragraph
2. Research findings: 3–6 bullets, each with its source
3. Code design: a module table plus a dependency diagram
4. Schema: SQL plus a diagram
5. Trade-offs and the choices you made, with the alternatives you rejected and why
6. Risks and open questions, including any business-logic assumptions to confirm
7. PR plan: the small PRs, in order
8. A checklist the finished PR must pass

Then **stop and wait for "go ahead"**. No code before approval.

## Step 6: After the build

Before opening the PR:
1. Check the code against the Step 5 checklist.
2. Run `npm run typecheck`, `npm test` and `npm run eval`.
3. Run `/document-feature` so the module README, its flow diagram and any ADR ship in the same PR. The design's research findings and rejected alternatives become the ADR's "Alternatives considered".
4. Report anything that changed from the approved design, and why.
