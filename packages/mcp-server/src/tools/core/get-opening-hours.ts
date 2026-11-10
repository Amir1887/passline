import * as z from "zod";
import { IsoDate, Weekday } from "../../data/schemas.js";
import { nextDateFor, todayIn } from "../../domain/dates.js";
import { openingStatus } from "../../domain/hours.js";
import { okJson, ToolInputError } from "../../results.js";
import { defineTool, READ_ONLY } from "../types.js";

export const getOpeningHours = defineTool({
  name: "get_opening_hours",
  title: "Opening hours",
  description: [
    "Get the restaurant's opening hours, last seating time and any closure for ONE day.",
    "Use when the guest asks if the restaurant is open, when it opens or closes, about last seating, or about holidays.",
    "Do NOT use to check whether a table is free; use check_availability for that.",
    "Input: `day` (lowercase weekday, e.g. \"friday\", meaning the next one, today included) OR `date` (YYYY-MM-DD). Send at most one; send neither for today.",
    "Times are 24-hour HH:MM in the restaurant's local time. The result includes `today` so you can work out dates such as \"tomorrow\".",
    'Example: {"day": "friday"}',
  ].join("\n"),
  inputSchema: z.object({
    day: Weekday.optional().describe('Lowercase weekday, e.g. "friday". Means the next one, today included.'),
    date: IsoDate.optional().describe('A calendar date, YYYY-MM-DD, e.g. "2026-12-24".'),
  }),
  outputSchema: z.object({
    date: z.string(),
    day: z.string(),
    open: z.boolean(),
    opens: z.string().optional(),
    closes: z.string().optional(),
    last_seating: z.string().optional(),
    note: z.string().optional(),
    reason: z.string().optional(),
    today: z.string(),
    timezone: z.string(),
    sandbox: z.string(),
  }),
  annotations: { ...READ_ONLY },
  handler({ day, date }, { data, clock }) {
    if (day && date) {
      throw new ToolInputError("send either `day` or `date`, not both.", 'keep only one, e.g. {"date": "2026-12-24"}.');
    }
    const today = todayIn(data.tenant.timezone, clock.now());
    const target = date ?? (day ? nextDateFor(day, today) : today);
    return okJson({
      ...openingStatus(data.hours, target),
      today,
      timezone: data.tenant.timezone,
      sandbox: data.tenant.sandbox_notice,
    });
  },
});
