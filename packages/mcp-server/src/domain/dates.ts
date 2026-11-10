import { WEEKDAYS, type Weekday } from "../data/schemas.js";

/** Today's date (YYYY-MM-DD) in the given IANA time zone. */
export function todayIn(timeZone: string, now: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** Weekday of a calendar date. Dates have no time zone, so UTC noon is safe. */
export function weekdayOf(date: string): Weekday {
  const index = new Date(`${date}T12:00:00Z`).getUTCDay(); // 0 = Sunday
  return WEEKDAYS[(index + 6) % 7] as Weekday;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The next date (today included) that falls on `day`. */
export function nextDateFor(day: Weekday, today: string): string {
  for (let offset = 0; offset < 7; offset++) {
    const candidate = addDays(today, offset);
    if (weekdayOf(candidate) === day) return candidate;
  }
  throw new Error(`unreachable: no ${day} within 7 days of ${today}`);
}
