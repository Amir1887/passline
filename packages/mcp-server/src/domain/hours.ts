import type { Hours, Weekday } from "../data/schemas.js";
import { weekdayOf } from "./dates.js";

export type OpeningStatus =
  | { date: string; day: Weekday; open: true; opens: string; closes: string; last_seating: string; note?: string }
  | { date: string; day: Weekday; open: false; reason: string };

/** Opening status for one calendar date: dated closures win over weekly hours. */
export function openingStatus(hours: Hours, date: string): OpeningStatus {
  const day = weekdayOf(date);
  const closure = hours.closures.find((c) => c.date === date);
  if (closure) return { date, day, open: false, reason: `Closed for ${closure.reason}` };

  const weekly = hours.weekly[day];
  if (!weekly) return { date, day, open: false, reason: `Closed every ${day[0]?.toUpperCase()}${day.slice(1)}` };

  return {
    date,
    day,
    open: true,
    opens: weekly.open,
    closes: weekly.close,
    last_seating: weekly.last_seating,
    ...(weekly.note ? { note: weekly.note } : {}),
  };
}
