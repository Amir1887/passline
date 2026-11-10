import type { Client } from "@modelcontextprotocol/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { loadTenantData } from "../../src/data/load.js";
import { describeFloorPlan } from "../../src/domain/floor-plan.js";
import { connectClient, DATA_DIR } from "../helpers/client.js";

type Block = { type: string; data?: string; mimeType?: string; text?: string };

let client: Client;
beforeAll(async () => {
  client = await connectClient();
});
afterAll(async () => {
  await client.close();
});

describe("get_floor_plan", () => {
  it("returns a PNG image block, then a text block", async () => {
    const result = await client.callTool({ name: "get_floor_plan", arguments: {} });
    const blocks = result.content as Block[];
    expect(result.isError).toBeFalsy();
    expect(blocks.map((b) => b.type)).toEqual(["image", "text"]);
    expect(blocks[0]?.mimeType).toBe("image/png");
  });

  it("the image is the exact committed PNG, base64-encoded", async () => {
    const result = await client.callTool({ name: "get_floor_plan", arguments: {} });
    const image = (result.content as Block[])[0];
    const bytes = Buffer.from(image?.data ?? "", "base64");
    expect(bytes.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    expect(bytes.equals(loadTenantData(DATA_DIR).floorPlanPng)).toBe(true);
  });

  it("has no structuredContent, so clients don't drop the image", async () => {
    const result = await client.callTool({ name: "get_floor_plan", arguments: {} });
    expect(result.structuredContent).toBeUndefined();
  });

  it("the text block names every table and area, and says the data is fictional", async () => {
    const result = await client.callTool({ name: "get_floor_plan", arguments: {} });
    const text = (result.content as Block[])[1]?.text ?? "";
    for (const table of loadTenantData(DATA_DIR).availability.tables) expect(text).toContain(`${table.id} (`);
    expect(text).toMatch(/Dining room: .*Terrace \(dogs welcome\): .*Private room \(staff arrange it\): PR \(12 seats\)\./);
    expect(text).toMatch(/fictional/i);
  });

  it("is listed as read-only, with no output schema", async () => {
    const { tools } = await client.listTools();
    const tool = tools.find((t) => t.name === "get_floor_plan");
    expect(tool?.annotations).toMatchObject({ readOnlyHint: true });
    expect(tool?.outputSchema).toBeUndefined();
  });
});

describe("describeFloorPlan", () => {
  it("groups tables by area in a fixed order and skips empty areas", () => {
    const text = describeFloorPlan({
      slot_minutes: 30,
      seating_minutes: 90,
      booking_window_days: 30,
      tables: [
        { id: "T2", seats: 1, area: "terrace" },
        { id: "T1", seats: 4, area: "dining" },
      ],
      recurring_bookings: [],
    });
    expect(text).toBe("Dining room: T1 (4 seats). Terrace (dogs welcome): T2 (1 seat).");
  });
});
