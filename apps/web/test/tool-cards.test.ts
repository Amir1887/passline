import { toolCatalog } from "passline-mcp/tools";
import { describe, expect, it } from "vitest";
import { toToolCards } from "../lib/tool-cards";

describe("toToolCards (built from the real MCP server tools)", () => {
  const cards = toToolCards(toolCatalog());

  it("shows all five tools the server registers", () => {
    expect(cards.map((c) => c.name)).toEqual(["get_opening_hours", "check_availability", "get_floor_plan", "search_menu", "check_allergens"]);
  });

  it("takes the summary and the 'Use when' line from the model-facing description", () => {
    for (const card of cards) {
      expect(card.summary).toMatch(/^(Get|Search|Check|Return) /);
      expect(card.useWhen).toMatch(/^Use when/);
    }
  });

  it("labels core and restaurant-kit tools", () => {
    expect(cards.filter((c) => c.kit === "restaurant").map((c) => c.name)).toEqual(["search_menu", "check_allergens"]);
  });
});
