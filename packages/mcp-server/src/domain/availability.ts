import { toMinutes, type Availability, type Hours, type Table } from "../data/schemas.js";
import { weekdayOf } from "./dates.js";
import { openingStatus } from "./hours.js";

const toTime = (minutes: number): string => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

/** Tables a guest can book directly (the private room is staff-only). */
function bookableTablesFor(availability: Availability, partySize: number): Table[] {
  return availability.tables.filter((t) => !t.staff_only && t.seats >= partySize);
}

/** A table is busy when a booking overlaps the requested seating. */
function isTableFree(availability: Availability, table: Table, date: string, start: number): boolean {
  const day = weekdayOf(date);
  return !availability.recurring_bookings.some(
    (b) => b.table === table.id && b.weekday === day && Math.abs(toMinutes(b.time) - start) < availability.seating_minutes,
  );
}

function freeTableAt(availability: Availability, tables: Table[], date: string, start: number): Table | undefined {
  // Smallest table that fits, so big tables stay free for big groups.
  return [...tables].sort((a, b) => a.seats - b.seats).find((t) => isTableFree(availability, t, date, start));
}

export type AvailabilityResult =
  | { available: true; area: Table["area"]; alternatives: string[] }
  | { available: false; reason: string; alternatives: string[] };

export function checkAvailability(
  hours: Hours,
  availability: Availability,
  query: { date: string; time: string; partySize: number },
  maxAlternatives = 4,
): AvailabilityResult {
  const status = openingStatus(hours, query.date);
  if (!status.open) return { available: false, reason: status.reason, alternatives: [] };

  const first = toMinutes(status.opens);
  const last = toMinutes(status.last_seating);
  const start = toMinutes(query.time);
  if (start < first || start > last) {
    return { available: false, reason: `Outside seating hours (${status.opens}–${status.last_seating})`, alternatives: [] };
  }

  const tables = bookableTablesFor(availability, query.partySize);
  if (tables.length === 0) {
    return { available: false, reason: `No table seats ${query.partySize} guests; larger groups need the private room, which staff arrange`, alternatives: [] };
  }

  // Nearest free slots on the same day, earliest first when equally near.
  const slots: number[] = [];
  for (let m = first; m <= last; m += availability.slot_minutes) if (m !== start) slots.push(m);
  const alternatives = slots
    .filter((m) => freeTableAt(availability, tables, query.date, m))
    .sort((a, b) => Math.abs(a - start) - Math.abs(b - start) || a - b)
    .slice(0, maxAlternatives)
    .sort((a, b) => a - b)
    .map(toTime);

  const table = freeTableAt(availability, tables, query.date, start);
  return table
    ? { available: true, area: table.area, alternatives }
    : { available: false, reason: "Fully booked at that time", alternatives };
}
