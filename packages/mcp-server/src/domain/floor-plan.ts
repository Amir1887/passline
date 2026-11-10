import type { Availability, Table } from "../data/schemas.js";

const AREA_LABELS: Record<Table["area"], string> = {
  dining: "Dining room",
  terrace: "Terrace (dogs welcome)",
  private: "Private room (staff arrange it)",
};

/**
 * A plain-text version of the floor plan, built from the same data as the
 * image, for models or clients that can't see images.
 */
export function describeFloorPlan(availability: Availability): string {
  const areas = (Object.keys(AREA_LABELS) as Table["area"][])
    .map((area) => {
      const tables = availability.tables.filter((t) => t.area === area);
      if (tables.length === 0) return null;
      const list = tables.map((t) => `${t.id} (${t.seats} ${t.seats === 1 ? "seat" : "seats"})`).join(", ");
      return `${AREA_LABELS[area]}: ${list}.`;
    })
    .filter((line): line is string => line !== null);
  return areas.join(" ");
}
