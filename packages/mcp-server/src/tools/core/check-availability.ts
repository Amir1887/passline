import * as z from "zod";
import { IsoDate, TimeOfDay, toMinutes } from "../../data/schemas.js";
import { checkAvailability } from "../../domain/availability.js";
import { addDays, todayIn, weekdayOf } from "../../domain/dates.js";
import { okJson, ToolInputError } from "../../results.js";
import { defineTool, READ_ONLY } from "../types.js";

export const checkAvailabilityTool = defineTool({
  name: "check_availability",
  title: "Check table availability",
  description: [
    "Check whether a table is free for a date, time and party size, and suggest the nearest free times that day.",
    'Use when the guest wants to book or asks "do you have a table…". This only checks; it does not book or hold a table.',
    "Do NOT use for opening hours alone; use get_opening_hours. For groups above the maximum party size, tell the guest to ask staff about the private room.",
    "Input: `date` = YYYY-MM-DD (today or later, within the booking window); `time` = 24-hour HH:MM on the hour or half hour; `party_size` = whole number from 1 to 12.",
    'Example: {"date": "2026-11-14", "time": "19:30", "party_size": 4}',
  ].join("\n"),
  inputSchema: z.object({
    date: IsoDate.describe("YYYY-MM-DD, today or later."),
    time: TimeOfDay.describe('24-hour HH:MM, e.g. "19:30".'),
    party_size: z.int().min(1).max(50).describe("Number of guests, 1 to 12."),
  }),
  outputSchema: z.object({
    date: z.string(),
    day: z.string(),
    time: z.string(),
    party_size: z.int(),
    available: z.boolean(),
    area: z.string().optional(),
    reason: z.string().optional(),
    alternatives: z.array(z.string()),
    note: z.string(),
    sandbox: z.string(),
  }),
  annotations: { ...READ_ONLY },
  handler({ date, time, party_size }, { data, clock }) {
    const { tenant, hours, availability } = data;
    if (party_size > tenant.max_party_size) {
      throw new ToolInputError(
        `party_size must be ${tenant.max_party_size} or fewer.`,
        "tell the guest that larger groups need the private room or a buyout, which staff arrange directly.",
      );
    }
    const today = todayIn(tenant.timezone, clock.now());
    if (date < today) throw new ToolInputError(`date ${date} is in the past (today is ${today}).`, "use today or a later date.");
    const lastBookable = addDays(today, availability.booking_window_days);
    if (date > lastBookable) {
      throw new ToolInputError(`bookings open ${availability.booking_window_days} days ahead; ${date} is too far out.`, `use a date up to ${lastBookable}.`);
    }
    if (toMinutes(time) % availability.slot_minutes !== 0) {
      throw new ToolInputError(`time must be on a ${availability.slot_minutes}-minute slot.`, 'round to the hour or half hour, e.g. "19:30".');
    }

    const result = checkAvailability(hours, availability, { date, time, partySize: party_size });
    return okJson({
      date,
      day: weekdayOf(date),
      time,
      party_size,
      ...result,
      note: "Availability check only. Booking comes in a later release.",
      sandbox: tenant.sandbox_notice,
    });
  },
});
