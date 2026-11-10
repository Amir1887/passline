import { describe, expect, it } from "vitest";
import { loadTenantData } from "../../src/data/load.js";
import { addDays, nextDateFor, todayIn, weekdayOf } from "../../src/domain/dates.js";
import { openingStatus } from "../../src/domain/hours.js";
import { DATA_DIR } from "../helpers/client.js";

describe("dates", () => {
  it("knows weekdays", () => {
    expect(weekdayOf("2026-11-10")).toBe("tuesday");
    expect(weekdayOf("2026-11-15")).toBe("sunday");
    expect(weekdayOf("2026-11-16")).toBe("monday");
  });

  it("uses the restaurant's time zone for today", () => {
    // 03:00 UTC on the 11th is still the 10th in New York
    expect(todayIn("America/New_York", new Date("2026-11-11T03:00:00Z"))).toBe("2026-11-10");
    expect(todayIn("UTC", new Date("2026-11-11T03:00:00Z"))).toBe("2026-11-11");
  });

  it("finds the next weekday, today included", () => {
    expect(nextDateFor("tuesday", "2026-11-10")).toBe("2026-11-10");
    expect(nextDateFor("friday", "2026-11-10")).toBe("2026-11-13");
    expect(nextDateFor("monday", "2026-11-10")).toBe("2026-11-16");
  });

  it("adds days across months and years", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("openingStatus", () => {
  const { hours } = loadTenantData(DATA_DIR);

  it("returns hours for an open day", () => {
    expect(openingStatus(hours, "2026-11-13")).toEqual({ date: "2026-11-13", day: "friday", open: true, opens: "17:00", closes: "23:00", last_seating: "22:00" });
  });

  it("includes the day's note", () => {
    expect(openingStatus(hours, "2026-11-15")).toMatchObject({ open: true, note: "Brunch until 15:00" });
  });

  it("is closed on Mondays", () => {
    expect(openingStatus(hours, "2026-11-16")).toEqual({ date: "2026-11-16", day: "monday", open: false, reason: "Closed every Monday" });
  });

  it("lets a dated closure win over normal hours", () => {
    expect(openingStatus(hours, "2026-12-25")).toEqual({ date: "2026-12-25", day: "friday", open: false, reason: "Closed for Christmas Day" });
  });
});
