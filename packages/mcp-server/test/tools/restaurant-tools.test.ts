import type { Client } from "@modelcontextprotocol/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { connectClient, textOf } from "../helpers/client.js";

let client: Client;
beforeAll(async () => {
  client = await connectClient(); // Tuesday 2026-11-10, New York
});
afterAll(async () => {
  await client.close();
});

const call = (name: string, args: Record<string, unknown>) => client.callTool({ name, arguments: args });
const sc = (r: { structuredContent?: unknown }) => r.structuredContent as Record<string, any>;

describe("search_menu", () => {
  it("returns the whole menu for {}", async () => {
    const r = await call("search_menu", {});
    expect(sc(r)).toMatchObject({ count: 9, currency: "USD", sandbox: expect.stringMatching(/fictional/i) });
  });

  it("filters vegetarian mains under $25", async () => {
    const r = await call("search_menu", { course: "main", vegetarian: true, max_price: 25 });
    expect(sc(r).dishes.map((d: any) => d.name)).toEqual(["Wild mushroom risotto", "Chickpea and spinach stew, flatbread"]);
  });

  it("finds a dish by words in any order and case", async () => {
    const r = await call("search_menu", { query: "BREAM sea" });
    expect(sc(r).dishes).toEqual([expect.objectContaining({ id: "ember-roasted-sea-bream", price: 28 })]);
  });

  it("filters vegan dishes", async () => {
    const r = await call("search_menu", { vegan: true });
    expect(sc(r).dishes.every((d: any) => d.vegan && d.vegetarian)).toBe(true);
    expect(sc(r).count).toBe(2);
  });

  it("returns zero results (not an error) when nothing matches", async () => {
    const r = await call("search_menu", { query: "pizza" });
    expect(r.isError).toBeFalsy();
    expect(sc(r)).toMatchObject({ count: 0, dishes: [] });
  });

  it("never returns allergen data (that's check_allergens' job)", async () => {
    const r = await call("search_menu", {});
    expect(JSON.stringify(sc(r))).not.toMatch(/contains|may_contain|allergen/);
  });

  it("rejects a negative max_price", async () => {
    const r = await call("search_menu", { max_price: -5 });
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/max_price/);
  });
});

describe("check_allergens", () => {
  it("the demo question: risotto may contain tree nuts, with the reason and staff note", async () => {
    const r = await call("check_allergens", { dish: "risotto", allergen: "tree_nuts" });
    expect(sc(r)).toMatchObject({
      dish: { id: "wild-mushroom-risotto", name: "Wild mushroom risotto" },
      allergen: "tree_nuts",
      status: "may_contain",
      reason: "Cooked in pans shared with the pistachio gremolata.",
      staff_note: expect.stringMatching(/staff must confirm/i),
    });
  });

  it("contains: halloumi with pistachio", async () => {
    expect(sc(await call("check_allergens", { dish: "halloumi", allergen: "tree_nuts" }))).toMatchObject({ status: "contains" });
  });

  it("not_listed is explicitly not a guarantee", async () => {
    const r = sc(await call("check_allergens", { dish: "sea bream", allergen: "gluten" }));
    expect(r).toMatchObject({ status: "not_listed", meaning: expect.stringMatching(/NOT a guarantee/) });
    expect(r.staff_note).toMatch(/staff must confirm/i);
  });

  it("not_tracked: an allergen the restaurant doesn't track", async () => {
    expect(sc(await call("check_allergens", { dish: "risotto", allergen: "celery" }))).toMatchObject({ status: "not_tracked" });
  });

  it("never uses wording that promises safety", async () => {
    for (const [dish, allergen] of [["sea bream", "gluten"], ["panna cotta", "peanuts"], ["risotto", "tree_nuts"]]) {
      const text = textOf(await call("check_allergens", { dish, allergen }));
      expect(text).not.toMatch(/\b(safe|free from|guaranteed|100%)\b/i);
    }
  });

  it("an ambiguous dish name lists the matches and how to fix the call", async () => {
    const r = await call("check_allergens", { dish: "flatbread", allergen: "gluten" });
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/matches 2 dishes: .*Charred flatbread.*Chickpea and spinach stew.* Fix: retry with a more specific name/);
  });

  it("an unknown dish points to search_menu", async () => {
    const r = await call("check_allergens", { dish: "pizza", allergen: "gluten" });
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/no dish matches "pizza"\. Fix: call search_menu/);
  });

  it("an unknown allergen code is rejected by the schema", async () => {
    const r = await call("check_allergens", { dish: "risotto", allergen: "nuts" });
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(/allergen/);
  });
});

describe("check_availability", () => {
  it("a table for 2 on Friday at 19:30 is free", async () => {
    const r = await call("check_availability", { date: "2026-11-13", time: "19:30", party_size: 2 });
    expect(sc(r)).toMatchObject({ day: "friday", available: true, area: "dining", note: expect.stringMatching(/check only/i) });
  });

  it("a table for 4 on Friday at 19:30 is fully booked, with the nearest free times", async () => {
    const r = await call("check_availability", { date: "2026-11-13", time: "19:30", party_size: 4 });
    expect(sc(r)).toMatchObject({ available: false, reason: "Fully booked at that time", alternatives: ["17:30", "18:00", "21:00", "21:30"] });
  });

  it("no regular table seats 7: points to the private room via staff", async () => {
    const r = await call("check_availability", { date: "2026-11-13", time: "18:00", party_size: 7 });
    expect(sc(r)).toMatchObject({ available: false, reason: expect.stringMatching(/private room/), alternatives: [] });
  });

  it("closed on Monday, and on Christmas Day", async () => {
    expect(sc(await call("check_availability", { date: "2026-11-16", time: "19:00", party_size: 2 }))).toMatchObject({ available: false, reason: "Closed every Monday" });
    expect(sc(await call("check_availability", { date: "2026-12-25", time: "19:00", party_size: 2 }))).toMatchObject({ available: false, reason: "Closed for Christmas Day" });
  });

  it("after last seating", async () => {
    const r = await call("check_availability", { date: "2026-11-13", time: "22:30", party_size: 2 });
    expect(sc(r)).toMatchObject({ available: false, reason: "Outside seating hours (17:00–22:00)" });
  });

  it.each([
    [{ date: "2026-11-13", time: "20:00", party_size: 40 }, /party_size must be 12 or fewer\. Fix: .*private room/],
    [{ date: "2026-11-09", time: "19:00", party_size: 2 }, /in the past \(today is 2026-11-10\)\. Fix: use today or a later date/],
    [{ date: "2027-02-01", time: "19:00", party_size: 2 }, /60 days ahead.* Fix: use a date up to 2027-01-09/],
    [{ date: "2026-11-13", time: "19:10", party_size: 2 }, /30-minute slot\. Fix: round/],
  ])("rejects %o with a fixable error", async (args, message) => {
    const r = await call("check_availability", args);
    expect(r.isError).toBe(true);
    expect(textOf(r)).toMatch(message);
  });

  it("schema rejects party_size 0 and malformed time", async () => {
    expect((await call("check_availability", { date: "2026-11-13", time: "19:30", party_size: 0 })).isError).toBe(true);
    expect((await call("check_availability", { date: "2026-11-13", time: "7.30pm", party_size: 2 })).isError).toBe(true);
  });
});

describe("tools/list", () => {
  it("shows the five tools: three core + two restaurant-kit", async () => {
    const { tools } = await client.listTools();
    expect(tools.map((t) => t.name).sort()).toEqual(["check_allergens", "check_availability", "get_floor_plan", "get_opening_hours", "search_menu"]);
  });
});
