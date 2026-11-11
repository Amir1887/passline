import { describe, expect, it } from "vitest";
import { toolCatalog } from "../src/catalog.js";
import { toolsFor } from "../src/tools/index.js";

describe("toolCatalog", () => {
  it("lists exactly the tools the server registers, in the same order", () => {
    expect(toolCatalog().map((t) => t.name)).toEqual(toolsFor("restaurant").map((t) => t.name));
  });

  it("marks core vs restaurant-kit tools and read-only", () => {
    const byName = Object.fromEntries(toolCatalog().map((t) => [t.name, t]));
    expect(byName.get_opening_hours).toMatchObject({ kit: "core", readOnly: true });
    expect(byName.check_allergens).toMatchObject({ kit: "restaurant", readOnly: true });
  });

  it("carries the full model-facing description", () => {
    expect(toolCatalog().every((t) => t.description.includes("Example:"))).toBe(true);
  });
});
