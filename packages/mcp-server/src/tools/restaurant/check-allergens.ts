import * as z from "zod";
import { ALLERGEN_CODES, AllergenCode } from "../../data/schemas.js";
import { allergenStatus, findDish } from "../../domain/menu.js";
import { okJson, ToolInputError } from "../../results.js";
import { defineTool, READ_ONLY } from "../types.js";

export const STAFF_NOTE = "Staff must confirm before ordering for any allergy, especially a severe one.";

const MEANING = {
  contains: "The dish contains this allergen as an ingredient.",
  may_contain: "Not an ingredient, but there is a cross-contact risk.",
  not_listed: "Not listed in the recipe. This is NOT a guarantee: the kitchen shares equipment.",
  not_tracked: "This restaurant does not track this allergen, so there is no information.",
} as const;

export const checkAllergensTool = defineTool({
  name: "check_allergens",
  title: "Check a dish for an allergen",
  description: [
    "Check whether ONE dish contains ONE allergen. Returns `status`: contains | may_contain | not_listed | not_tracked, its meaning, and a staff note.",
    'Use whenever the guest asks if a dish is safe for an allergy, or is nut-free, gluten-free, dairy-free and so on. For several dishes or allergens, call it once per pair.',
    "Never tell the guest a dish is safe or allergen-free. `not_listed` is not a guarantee. Always pass on `staff_note`. Do NOT use to list dishes; use search_menu.",
    `Input: \`dish\` = the dish name or a unique part of it (e.g. "risotto"); \`allergen\` = one of: ${ALLERGEN_CODES.join(", ")}.`,
    'Example: {"dish": "risotto", "allergen": "tree_nuts"}',
  ].join("\n"),
  inputSchema: z.object({
    dish: z.string().trim().min(2).max(60).describe('Dish name or a unique part of it, e.g. "risotto".'),
    allergen: AllergenCode.describe('Allergen code, e.g. "tree_nuts" for nuts like pistachio or hazelnut.'),
  }),
  outputSchema: z.object({
    dish: z.object({ id: z.string(), name: z.string() }),
    allergen: z.string(),
    status: z.enum(["contains", "may_contain", "not_listed", "not_tracked"]),
    meaning: z.string(),
    reason: z.string().optional(),
    staff_note: z.string(),
    sandbox: z.string(),
  }),
  annotations: { ...READ_ONLY },
  handler({ dish: query, allergen }, { data }) {
    const menu = data.kit.menu;
    const match = findDish(menu, query);
    if (match.kind === "none") {
      throw new ToolInputError(`no dish matches "${query}".`, "call search_menu to see the dish names, then retry with one of them.");
    }
    if (match.kind === "many") {
      throw new ToolInputError(
        `"${query}" matches ${match.dishes.length} dishes: ${match.dishes.map((d) => d.name).join("; ")}.`,
        "retry with a more specific name, or call once for each dish.",
      );
    }
    const dish = match.dish;
    const status = allergenStatus(menu, dish, allergen);
    return okJson({
      dish: { id: dish.id, name: dish.name },
      allergen,
      status,
      meaning: MEANING[status],
      ...(status === "may_contain" && dish.may_contain_reason ? { reason: dish.may_contain_reason } : {}),
      staff_note: STAFF_NOTE,
      sandbox: data.tenant.sandbox_notice,
    });
  },
});
