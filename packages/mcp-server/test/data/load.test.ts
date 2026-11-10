import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { DataFileError, loadTenantData } from "../../src/data/load.js";

const realDir = fileURLToPath(new URL("../../../../data/thymewick/", import.meta.url));
const tempDirs: string[] = [];

/** Copies the real data into a temp folder and lets the test break one file. */
function withEdit(file: string, edit: (json: Record<string, any>) => void): string {
  const dir = mkdtempSync(join(tmpdir(), "passline-data-"));
  tempDirs.push(dir);
  cpSync(realDir, dir, { recursive: true });
  const path = join(dir, file);
  const json = JSON.parse(readFileSync(path, "utf8"));
  edit(json);
  writeFileSync(path, JSON.stringify(json));
  return dir;
}

function issuesOf(fn: () => unknown): { file: string; issues: string[] } {
  try {
    fn();
  } catch (error) {
    if (error instanceof DataFileError) return { file: error.file, issues: error.issues };
    throw error;
  }
  throw new Error("expected loadTenantData to throw DataFileError");
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("loadTenantData: the real Thymewick data", () => {
  it("loads and validates every file", () => {
    const data = loadTenantData(realDir);
    expect(data.tenant).toMatchObject({ id: "thymewick", name: "Thymewick", vertical: "restaurant", currency: "USD" });
    expect(data.hours.weekly.monday).toBeNull();
    expect(data.hours.weekly.friday).toEqual({ open: "17:00", close: "23:00", last_seating: "22:00" });
    expect(data.availability.tables).toHaveLength(14);
    expect(data.kit.menu.dishes.length).toBeGreaterThanOrEqual(9);
    expect(data.floorPlanPng.length).toBeGreaterThan(1000);
  });

  it("has the demo dish: risotto that may contain tree nuts, with a reason", () => {
    const risotto = loadTenantData(realDir).kit.menu.dishes.find((d) => d.id === "wild-mushroom-risotto");
    expect(risotto).toMatchObject({ may_contain: ["tree_nuts"], contains: ["dairy"] });
    expect(risotto?.may_contain_reason).toBeTruthy();
  });

  it("marks itself as fictional", () => {
    expect(loadTenantData(realDir).tenant.sandbox_notice).toMatch(/fictional/i);
  });
});

describe("loadTenantData: rejects broken data with the file and field", () => {
  it("bad time format", () => {
    const dir = withEdit("hours.json", (h) => (h.weekly.friday.open = "5pm"));
    expect(issuesOf(() => loadTenantData(dir))).toEqual({ file: "hours.json", issues: [expect.stringContaining("weekly.friday.open")] });
  });

  it("closing before opening", () => {
    const dir = withEdit("hours.json", (h) => (h.weekly.friday = { open: "23:00", close: "17:00", last_seating: "22:00" }));
    const { file, issues } = issuesOf(() => loadTenantData(dir));
    expect(file).toBe("hours.json");
    expect(issues.join("\n")).toMatch(/open must be before close/);
  });

  it("last seating after closing", () => {
    const dir = withEdit("hours.json", (h) => (h.weekly.sunday.last_seating = "21:30"));
    expect(issuesOf(() => loadTenantData(dir)).issues.join("\n")).toMatch(/last_seating must be between open and close/);
  });

  it("duplicate closure dates", () => {
    const dir = withEdit("hours.json", (h) => h.closures.push({ date: "2026-12-25", reason: "Again" }));
    expect(issuesOf(() => loadTenantData(dir)).issues.join("\n")).toMatch(/only once/);
  });

  it("a booking that points to a table that doesn't exist", () => {
    const dir = withEdit("availability.json", (a) => a.recurring_bookings.push({ weekday: "friday", time: "19:00", table: "T99" }));
    expect(issuesOf(() => loadTenantData(dir))).toEqual({ file: "availability.json", issues: [expect.stringContaining('Unknown table "T99"')] });
  });

  it("a booking time that isn't on a slot", () => {
    const dir = withEdit("availability.json", (a) => a.recurring_bookings.push({ weekday: "friday", time: "19:10", table: "T1" }));
    expect(issuesOf(() => loadTenantData(dir)).issues.join("\n")).toMatch(/30-minute slot/);
  });

  it("an allergen that isn't in the allergen list", () => {
    const dir = withEdit("menu.json", (m) => m.dishes[0].contains.push("celery"));
    expect(issuesOf(() => loadTenantData(dir))).toEqual({ file: "menu.json", issues: [expect.stringContaining('Unknown allergen "celery"')] });
  });

  it("may_contain without a reason", () => {
    const dir = withEdit("menu.json", (m) => delete m.dishes.find((d: any) => d.id === "wild-mushroom-risotto").may_contain_reason);
    expect(issuesOf(() => loadTenantData(dir)).issues.join("\n")).toMatch(/may_contain_reason/);
  });

  it("a vegan dish that isn't vegetarian", () => {
    const dir = withEdit("menu.json", (m) => (m.dishes[1].vegetarian = false));
    expect(issuesOf(() => loadTenantData(dir)).issues.join("\n")).toMatch(/vegan dish must also be vegetarian/);
  });

  it("an unknown time zone", () => {
    const dir = withEdit("restaurant.json", (r) => (r.timezone = "Mars/Olympus"));
    expect(issuesOf(() => loadTenantData(dir))).toEqual({ file: "restaurant.json", issues: [expect.stringContaining("time zone")] });
  });

  it("a max party size bigger than any table", () => {
    const dir = withEdit("restaurant.json", (r) => (r.max_party_size = 20));
    expect(issuesOf(() => loadTenantData(dir)).issues.join("\n")).toMatch(/larger than the largest table/);
  });

  it("invalid JSON", () => {
    const dir = withEdit("menu.json", () => undefined);
    writeFileSync(join(dir, "menu.json"), "{ not json");
    expect(issuesOf(() => loadTenantData(dir))).toEqual({ file: "menu.json", issues: [expect.stringContaining("not valid JSON")] });
  });

  it("a missing file", () => {
    const dir = withEdit("menu.json", () => undefined);
    rmSync(join(dir, "availability.json"));
    expect(issuesOf(() => loadTenantData(dir))).toEqual({ file: "availability.json", issues: [expect.stringContaining("cannot read")] });
  });
});
