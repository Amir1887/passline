# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript, Tailwind CSS + shadcn/ui, Supabase Postgres + pgvector, deployed on Vercel (from docs/PROJECT-BRIEF.md). Design prototypes are single-file HTML artifacts until the app is scaffolded.

## Users

- **Primary:** an Upwork client, often a non-technical restaurant or small-business owner, deciding in a few seconds whether to hire the developer. They open the live demo from a proposal link and try it.
- **Secondary:** technical reviewers (developers, CTOs) who open "How I built this" and the code.
- The in-product persona is a restaurant guest asking the front desk a question; the visitor plays that guest.

## Product Purpose

Passline is an AI front desk for restaurants (portfolio demo). It answers guest questions from the restaurant's own documents with page-level citations, refuses to guess when the documents don't cover something, and hands allergy and safety questions to staff. Success: after one minute, the client believes **"this could run my front desk"**, i.e. it feels like a real product a restaurant could switch on.

## Positioning

Every answer is traceable to an exact passage on an exact page, and the system says "I don't know" instead of inventing policy, prices or promises. Safety questions never get a guarantee. Features ship one release at a time, each real and testable, never a mockup.

## Operating Context

- Demo restaurant: **Thymewick** (fictional), with four source documents: Menu, Allergen guide, Booking policy, Opening hours & FAQ.
- Public demo with rate limits (about 20 questions per hour) and a daily AI spend cap; uploads and real messages are admin-only.
- Release 1 surfaces: Overview (pitch + roadmap) and Knowledge desk (chat + source evidence + "Test a failure" + "How I built this").
- Later releases: bookings, website widget, WhatsApp (English + Arabic), Stripe deposits, AI Inspector/MCP, campaigns/CRM, second tenant.
- **Industry-ready core (decided 2026-11-10):** restaurants only for now, but the engine is built to be reused later for other industries (medical/clinics is the planned next one) through an industry switcher. Code and schema use generic names (`contacts`, `bookings`, `resources`, `handoffs.reason`); industry words live only in a per-vertical config, which holds UI labels, safety rules, document types and its eval set. `tenants.vertical` = `restaurant` only in Phase 1. No medical code until it is explicitly started. A medical vertical will need its own safety rules (no diagnosis or advice; emergency → call emergency services), its own evals, and HIPAA-aware hosting/BAAs; label changes alone are not enough.
- Name: **Passline** stays for now; revisit if/when the medical vertical ships.
- Second fictional tenant (Phase 8): **Saltquay**, a coastal seafood restaurant. Both names were chosen 2026-11-10 after web searches found no exact-match restaurants.

## Capabilities and Constraints

- Fictional data only. Never real companies or people, and no private client or employer data.
- The only names are Passline, Thymewick and Saltquay. Earlier working names belonged to real businesses and must not appear.
- Arabic (RTL) arrives in Release 4; layouts should not block it.
- Evals: 30 questions (20 answerable, 5 not on file, 5 safety) **plus 3 tenant-isolation tests** (decided 2026-11-10).
- Models (decided 2026-11-10): free models (Gemini / Groq) for development and eval runs; Claude Haiku in the live demo. The UI shows which model answered, lets the visitor switch models, and shows each answer's cost and steps.
- Spend caps (confirmed 2026-11-10): **$1 per day is the maximum the whole app may spend, all models combined.** Claude: 1 question per visitor per day; when the day's $1 is used, Claude shows "Back tomorrow" and the free models keep working. Free models: 20 questions per visitor per hour. Visitors are identified by IP + cookie (bypassable), so the global cap is the real protection.
- Public display name: **Amir Gad** (decided 2026-11-10). Use it in README, LICENSE, git author and the "Built by" line.

## Brand Commitments

- Name: **Passline**. Tagline: "AI front desk for restaurants (portfolio demo)". The "pass" is where a kitchen hands food to service; the product hands work off between AI, staff, payments and CRM.
- Every page explains itself with a "How I built this" panel.

## Evidence on Hand

- Brief: docs/PROJECT-BRIEF.md. Early mockups (local only, gitignored): docs/mockups/.
- No real customers, testimonials, usage numbers or eval scores exist yet. Eval results must read "not run yet" until the suite runs. Costs and token counts in prototypes are labelled example values.

## Product Principles

1. Prove, don't claim: every capability is something a visitor can try.
2. Trust is visible: show the source, show the refusal, show the handoff.
3. Safe to leave online: limits and fallbacks are part of the product, not hidden.
4. Explain the engineering one click away, never in the guest's way.
