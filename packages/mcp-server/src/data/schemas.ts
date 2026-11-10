/**
 * Zod schemas for the tenant data files in data/<tenant>/.
 *
 * Core schemas (tenant, hours, availability) work for any business.
 * Kit schemas (menu) belong to one vertical; the tenant's `vertical` field
 * decides which kit is loaded.
 */
import * as z from "zod";

export const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export const Weekday = z.enum(WEEKDAYS);
export type Weekday = z.infer<typeof Weekday>;

/** 24-hour local time, "HH:MM". */
export const TimeOfDay = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected 24-hour time HH:MM, e.g. 19:30");
/** Calendar date, "YYYY-MM-DD". */
export const IsoDate = z.iso.date();

export const toMinutes = (time: string): number => {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

function isTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

// ---------- core ----------

export const Tenant = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Lowercase letters, digits and dashes only"),
  name: z.string().min(1),
  vertical: z.enum(["restaurant"]),
  timezone: z.string().refine(isTimeZone, "Unknown IANA time zone"),
  currency: z.string().regex(/^[A-Z]{3}$/, "ISO 4217 code, e.g. USD"),
  max_party_size: z.int().min(1).max(50),
  sandbox_notice: z.string().min(1),
});
export type Tenant = z.infer<typeof Tenant>;

const isTime = (value: string): boolean => TimeOfDay.safeParse(value).success;

export const DayHours = z
  .object({
    open: TimeOfDay,
    close: TimeOfDay,
    last_seating: TimeOfDay,
    note: z.string().min(1).optional(),
  })
  .superRefine((h, ctx) => {
    // Order checks only make sense once every time is well-formed; otherwise
    // the format error above is the one message worth showing.
    if (![h.open, h.close, h.last_seating].every(isTime)) return;
    if (toMinutes(h.open) >= toMinutes(h.close)) ctx.addIssue({ code: "custom", message: "open must be before close", path: ["close"] });
    else if (toMinutes(h.last_seating) < toMinutes(h.open) || toMinutes(h.last_seating) > toMinutes(h.close)) {
      ctx.addIssue({ code: "custom", message: "last_seating must be between open and close", path: ["last_seating"] });
    }
  });
export type DayHours = z.infer<typeof DayHours>;

export const Hours = z.object({
  weekly: z.object(Object.fromEntries(WEEKDAYS.map((day) => [day, DayHours.nullable()])) as Record<Weekday, z.ZodNullable<typeof DayHours>>),
  closures: z
    .array(z.object({ date: IsoDate, reason: z.string().min(1) }))
    .refine((list) => new Set(list.map((c) => c.date)).size === list.length, "Each closure date may appear only once"),
});
export type Hours = z.infer<typeof Hours>;

export const Table = z.object({
  id: z.string().regex(/^[A-Z0-9]+$/, "Table ids are uppercase, e.g. T1"),
  seats: z.int().min(1).max(50),
  area: z.enum(["dining", "terrace", "private"]),
  staff_only: z.boolean().optional(),
});
export type Table = z.infer<typeof Table>;

export const Availability = z
  .object({
    slot_minutes: z.int().refine((m) => [15, 30, 60].includes(m), "slot_minutes must be 15, 30 or 60"),
    seating_minutes: z.int().min(30).max(240),
    booking_window_days: z.int().min(1).max(365),
    tables: z.array(Table).min(1),
    recurring_bookings: z.array(z.object({ weekday: Weekday, time: TimeOfDay, table: z.string() })),
  })
  .superRefine((a, ctx) => {
    const ids = a.tables.map((t) => t.id);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Table ids must be unique", path: ["tables"] });
    a.recurring_bookings.forEach((b, i) => {
      if (!ids.includes(b.table)) ctx.addIssue({ code: "custom", message: `Unknown table "${b.table}"`, path: ["recurring_bookings", i, "table"] });
      if (toMinutes(b.time) % a.slot_minutes !== 0) {
        ctx.addIssue({ code: "custom", message: `Time must fall on a ${a.slot_minutes}-minute slot`, path: ["recurring_bookings", i, "time"] });
      }
    });
  });
export type Availability = z.infer<typeof Availability>;

// ---------- restaurant kit ----------

/**
 * Allergen codes any restaurant tenant may track (the 14 common regulated
 * allergens). A tenant lists the ones it tracks in menu.json; asking about one
 * it doesn't track gets an honest "not_tracked" answer, never a guess.
 */
export const ALLERGEN_CODES = [
  "gluten",
  "dairy",
  "eggs",
  "tree_nuts",
  "peanuts",
  "sesame",
  "fish",
  "shellfish",
  "molluscs",
  "soy",
  "mustard",
  "celery",
  "sulphites",
  "lupin",
] as const;
export const AllergenCode = z.enum(ALLERGEN_CODES);
export type AllergenCode = z.infer<typeof AllergenCode>;

export const Dish = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    course: z.enum(["starter", "main", "dessert"]),
    price_usd: z.number().positive(),
    vegetarian: z.boolean(),
    vegan: z.boolean(),
    contains: z.array(z.string()),
    may_contain: z.array(z.string()),
    may_contain_reason: z.string().min(1).optional(),
  })
  .refine((d) => !d.vegan || d.vegetarian, { message: "A vegan dish must also be vegetarian", path: ["vegetarian"] })
  .refine((d) => d.may_contain.length === 0 || d.may_contain_reason !== undefined, {
    message: "Explain may_contain with may_contain_reason",
    path: ["may_contain_reason"],
  });
export type Dish = z.infer<typeof Dish>;

export const Menu = z
  .object({ allergens: z.array(AllergenCode).min(1), dishes: z.array(Dish).min(1) })
  .superRefine((m, ctx) => {
    const known = new Set<string>(m.allergens);
    const ids = m.dishes.map((d) => d.id);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Dish ids must be unique", path: ["dishes"] });
    m.dishes.forEach((d, i) => {
      for (const field of ["contains", "may_contain"] as const) {
        d[field].forEach((allergen, j) => {
          if (!known.has(allergen)) ctx.addIssue({ code: "custom", message: `Unknown allergen "${allergen}"`, path: ["dishes", i, field, j] });
        });
      }
      const both = d.contains.filter((a) => d.may_contain.includes(a));
      if (both.length) ctx.addIssue({ code: "custom", message: `Allergen listed as both contains and may_contain: ${both.join(", ")}`, path: ["dishes", i] });
    });
  });
export type Menu = z.infer<typeof Menu>;
