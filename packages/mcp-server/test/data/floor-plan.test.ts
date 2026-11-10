import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { loadTenantData } from "../../src/data/load.js";

const dir = fileURLToPath(new URL("../../../../data/thymewick/", import.meta.url));

describe("floor plan", () => {
  const data = loadTenantData(dir);
  const svg = readFileSync(`${dir}floor-plan.svg`, "utf8");

  it("is a reasonably small PNG for an MCP image response", () => {
    expect(data.floorPlanPng.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(data.floorPlanPng.length).toBeLessThan(300_000);
    // PNG header: width and height are big-endian at bytes 16..23
    expect(data.floorPlanPng.readUInt32BE(16)).toBe(1280);
    expect(data.floorPlanPng.readUInt32BE(20)).toBe(800);
  });

  it("shows every table from availability.json, with its id", () => {
    const missing = data.availability.tables.map((t) => t.id).filter((id) => !svg.includes(`>${id}<`));
    expect(missing).toEqual([]);
  });

  it("is labelled as fictional", () => {
    expect(svg).toMatch(/Fictional demo restaurant/);
  });

  it("draws exactly one label per table (no extra or missing tables)", () => {
    const drawnTables = (svg.match(/class="tl">/g) ?? []).length;
    expect(drawnTables).toBe(data.availability.tables.length);
  });
});
