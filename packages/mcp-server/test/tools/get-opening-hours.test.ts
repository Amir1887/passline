import type { Client } from "@modelcontextprotocol/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { connectClient, textOf } from "../helpers/client.js";

let client: Client;
beforeEach(async () => {
  client = await connectClient(); // Tuesday 2026-11-10 in New York
});
afterEach(async () => {
  await client.close();
});

const call = (args: Record<string, unknown>) => client.callTool({ name: "get_opening_hours", arguments: args });

describe("get_opening_hours: valid input", () => {
  it("answers for a weekday name (the next one)", async () => {
    const result = await call({ day: "friday" });
    expect(result.isError).toBeFalsy();
    expect(result.structuredContent).toMatchObject({
      date: "2026-11-13",
      day: "friday",
      open: true,
      opens: "17:00",
      closes: "23:00",
      last_seating: "22:00",
      today: "2026-11-10",
      timezone: "America/New_York",
    });
  });

  it("answers for a date", async () => {
    const result = await call({ date: "2026-11-15" });
    expect(result.structuredContent).toMatchObject({ day: "sunday", open: true, note: "Brunch until 15:00" });
  });

  it("answers for today when no input is given", async () => {
    const result = await call({});
    expect(result.structuredContent).toMatchObject({ date: "2026-11-10", day: "tuesday", open: true });
  });

  it("returns the same data as JSON text, for clients that ignore structuredContent", async () => {
    const result = await call({ day: "friday" });
    expect(JSON.parse(textOf(result))).toEqual(result.structuredContent);
  });

  it("always marks the answer as fictional", async () => {
    const result = await call({ day: "friday" });
    expect(result.structuredContent).toMatchObject({ sandbox: expect.stringMatching(/fictional/i) });
  });
});

describe("get_opening_hours: edge cases", () => {
  it("Monday is closed", async () => {
    expect((await call({ day: "monday" })).structuredContent).toMatchObject({ open: false, reason: "Closed every Monday" });
  });

  it("a holiday closure wins over Friday hours", async () => {
    expect((await call({ date: "2026-12-25" })).structuredContent).toMatchObject({ day: "friday", open: false, reason: "Closed for Christmas Day" });
  });
});

describe("get_opening_hours: invalid input returns a tool error, never a crash", () => {
  it("both day and date", async () => {
    const result = await call({ day: "friday", date: "2026-11-13" });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/^Invalid input: send either `day` or `date`, not both\. Fix: /);
  });

  it("a capitalised or unknown weekday", async () => {
    const result = await call({ day: "Friday" });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/day/);
  });

  it("a badly formatted date", async () => {
    const result = await call({ date: "13/11/2026" });
    expect(result.isError).toBe(true);
    expect(textOf(result)).toMatch(/date/);
  });

  it("keeps working after an error", async () => {
    await call({ date: "nope" });
    expect((await call({ day: "friday" })).isError).toBeFalsy();
  });
});
