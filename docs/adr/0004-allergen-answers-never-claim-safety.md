# 0004. Allergen answers never claim a dish is safe

Date: 2026-11-10 · Status: Accepted

## Context

Guests ask "is the risotto nut-free?". An AI that answers "yes" on the strength of a recipe list can cause real harm: kitchens share pans, fryers and prep areas, and recipes change. Passline must be useful (say what the data shows) without ever promising safety, and the model must not be able to turn the data into a promise.

## Decision

`check_allergens` checks one dish and one allergen and returns one of four statuses, each with a fixed meaning sentence and the same `staff_note`:

| status | meaning |
|---|---|
| `contains` | The allergen is an ingredient |
| `may_contain` | Cross-contact risk, with the kitchen's reason (e.g. "Cooked in pans shared with the pistachio gremolata.") |
| `not_listed` | Not in the recipe. **Not a guarantee**: the kitchen shares equipment |
| `not_tracked` | The restaurant doesn't track this allergen, so there is no information |

- There is deliberately **no** `free_of`, `safe` or `allergen_free` status.
- The data schema requires a `may_contain_reason` for every `may_contain` entry.
- `search_menu` returns **no allergen data**, so the model can't answer allergy questions from a menu listing; its description sends the model to `check_allergens`.
- The tool description tells the model: never say a dish is safe, `not_listed` is not a guarantee, always pass on `staff_note`.
- Allergen codes come from a fixed list of 14 common regulated allergens; asking about one the tenant doesn't track returns `not_tracked` instead of a guess.
- Tests check every status, and that no answer uses safety wording ("safe", "free from", "guaranteed", "100%").

## Alternatives considered

- **`free_of` / `safe` status:** simpler for the model, but it reads as a promise. Rejected.
- **Return allergens inside `search_menu`:** fewer calls, but the model would then answer safety questions without the meaning and the staff note. Rejected.
- **Refuse all allergy questions:** safest for the operator, but useless for guests and not how a good front desk works. Sharing documented facts plus a staff handoff is the balance.

## Consequences

- Easier: a reviewer can see exactly how safety is handled, in code, schema and tests.
- Harder: multi-dish or multi-allergen questions need several calls (one per pair).
- Follow-up: the Phase 1 knowledge desk applies the same rule to RAG answers (amber "Staff confirmation required" + handoff).
