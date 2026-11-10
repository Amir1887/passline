import * as z from "zod";
import { searchMenu } from "../../domain/menu.js";
import { okJson } from "../../results.js";
import { defineTool, READ_ONLY } from "../types.js";

export const searchMenuTool = defineTool({
  name: "search_menu",
  title: "Search the menu",
  description: [
    "Search the restaurant's menu and return matching dishes with prices.",
    'Use when the guest asks what dishes there are, about prices, or for filters like "vegetarian mains under $25" or "do you have sea bream?".',
    "Do NOT use for allergy or dietary-safety questions; use check_allergens, which returns the safety answer and staff note. This tool deliberately returns no allergen data.",
    "Input: all fields optional. `query` = words in the dish name; `course` = starter | main | dessert; `vegetarian` / `vegan` = true to filter; `max_price` = a number in the menu currency (USD). Send {} for the whole menu.",
    'Example: {"course": "main", "vegetarian": true, "max_price": 25}',
  ].join("\n"),
  inputSchema: z.object({
    query: z.string().trim().min(1).max(60).optional().describe('Words in the dish name, e.g. "risotto".'),
    course: z.enum(["starter", "main", "dessert"]).optional(),
    vegetarian: z.boolean().optional().describe("true = vegetarian dishes only."),
    vegan: z.boolean().optional().describe("true = vegan dishes only."),
    max_price: z.number().positive().max(10_000).optional().describe("Highest price, in USD."),
  }),
  outputSchema: z.object({
    count: z.int(),
    currency: z.string(),
    dishes: z.array(z.object({ id: z.string(), name: z.string(), course: z.string(), price: z.number(), vegetarian: z.boolean(), vegan: z.boolean() })),
    sandbox: z.string(),
  }),
  annotations: { ...READ_ONLY },
  handler(filters, { data }) {
    const dishes = searchMenu(data.kit.menu, filters).map(({ id, name, course, price_usd, vegetarian, vegan }) => ({ id, name, course, price: price_usd, vegetarian, vegan }));
    return okJson({ count: dishes.length, currency: data.tenant.currency, dishes, sandbox: data.tenant.sandbox_notice });
  },
});
