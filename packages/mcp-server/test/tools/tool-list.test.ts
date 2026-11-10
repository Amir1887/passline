import { describe, expect, it } from "vitest";
import { toolsFor } from "../../src/tools/index.js";
import { connectClient } from "../helpers/client.js";

/**
 * Description rules (README → "How tool descriptions are written"), checked for
 * every tool so a new tool can't skip them.
 */
describe("tool definitions", () => {
  const tools = toolsFor("restaurant");

  it.each(tools.map((t) => [t.name, t] as const))("%s follows the description rules", (_name, tool) => {
    expect(tool.name).toMatch(/^[a-z][a-z0-9_]{2,40}$/);
    expect(tool.title.length).toBeGreaterThan(2);
    expect(tool.description).toMatch(/^Get|^Search|^Check|^Return/); // 1. leads with the job
    expect(tool.description).toMatch(/Use when/); // 2. when to use
    expect(tool.description).toMatch(/Do NOT use|Never/); // 3. when not to (or a hard limit)
    expect(tool.description).toMatch(/Input:/); // 4. formats and units
    expect(tool.description).toMatch(/Example: \{.*\}/); // 5. one example
    expect(tool.description.length).toBeLessThan(1200);
    expect(tool.annotations.readOnlyHint).toBe(true);
  });

  it("names are unique", () => {
    const names = tools.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe("tools/list as a client sees it", () => {
  it("exposes each tool with title, description, input schema and read-only hints", async () => {
    const client = await connectClient();
    try {
      const { tools } = await client.listTools();
      const hours = tools.find((t) => t.name === "get_opening_hours");
      expect(hours).toBeDefined();
      expect(hours?.title).toBe("Opening hours");
      expect(hours?.annotations).toMatchObject({ readOnlyHint: true, destructiveHint: false, openWorldHint: false });
      expect(hours?.inputSchema).toMatchObject({ type: "object", properties: { day: expect.any(Object), date: expect.any(Object) } });
      expect(hours?.outputSchema).toMatchObject({ type: "object" });
    } finally {
      await client.close();
    }
  });
});
