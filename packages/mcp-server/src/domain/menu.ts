import type { AllergenCode, Dish, Menu } from "../data/schemas.js";

export type Course = Dish["course"];

export interface MenuFilters {
  query?: string | undefined;
  course?: Course | undefined;
  vegetarian?: boolean | undefined;
  vegan?: boolean | undefined;
  max_price?: number | undefined;
}

const words = (text: string): string[] =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

/** Every word of the query must appear in the dish name (order and case don't matter). */
function matchesQuery(dish: Dish, query: string): boolean {
  const name = new Set(words(dish.name));
  const nameText = words(dish.name).join(" ");
  return words(query).every((w) => name.has(w) || nameText.includes(w));
}

export function searchMenu(menu: Menu, filters: MenuFilters): Dish[] {
  return menu.dishes.filter(
    (d) =>
      (!filters.query || matchesQuery(d, filters.query)) &&
      (!filters.course || d.course === filters.course) &&
      (!filters.vegetarian || d.vegetarian) &&
      (!filters.vegan || d.vegan) &&
      (filters.max_price === undefined || d.price_usd <= filters.max_price),
  );
}

export type DishMatch = { kind: "one"; dish: Dish } | { kind: "none" } | { kind: "many"; dishes: Dish[] };

/** Exact id or name first; otherwise every query word must match one dish only. */
export function findDish(menu: Menu, query: string): DishMatch {
  const q = words(query).join(" ");
  const exact = menu.dishes.find((d) => d.id === query.trim().toLowerCase() || words(d.name).join(" ") === q);
  if (exact) return { kind: "one", dish: exact };
  const hits = menu.dishes.filter((d) => matchesQuery(d, query));
  if (hits.length === 1 && hits[0]) return { kind: "one", dish: hits[0] };
  if (hits.length === 0) return { kind: "none" };
  return { kind: "many", dishes: hits };
}

/**
 * contains:    the allergen is an ingredient.
 * may_contain: cross-contact risk (shared pans, fryers…), with the reason.
 * not_listed:  not in the recipe. NOT a guarantee: kitchens share equipment.
 * not_tracked: this restaurant doesn't track that allergen at all.
 */
export type AllergenStatus = "contains" | "may_contain" | "not_listed" | "not_tracked";

export function allergenStatus(menu: Menu, dish: Dish, allergen: AllergenCode): AllergenStatus {
  if (!menu.allergens.includes(allergen)) return "not_tracked";
  if (dish.contains.includes(allergen)) return "contains";
  if (dish.may_contain.includes(allergen)) return "may_contain";
  return "not_listed";
}
