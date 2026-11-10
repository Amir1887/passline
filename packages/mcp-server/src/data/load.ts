/**
 * Loads and validates one tenant's data folder (e.g. data/thymewick/).
 *
 * Every file is checked with its Zod schema at startup. A bad file stops the
 * server with a message naming the file and the field, instead of failing
 * later inside a tool call.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type * as z from "zod";
import { Availability, Hours, Menu, Tenant } from "./schemas.js";

export type RestaurantKit = { vertical: "restaurant"; menu: Menu };

export interface TenantData {
  tenant: Tenant;
  hours: Hours;
  availability: Availability;
  /** Pre-rendered floor plan, PNG bytes. */
  floorPlanPng: Buffer;
  kit: RestaurantKit;
}

export class DataFileError extends Error {
  constructor(
    readonly file: string,
    readonly issues: string[],
  ) {
    super(`Invalid data file ${file}:\n${issues.map((i) => `  - ${i}`).join("\n")}`);
    this.name = "DataFileError";
  }
}

function readJson(dir: string, file: string): unknown {
  const path = join(dir, file);
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (cause) {
    throw new DataFileError(file, [`cannot read ${path}: ${(cause as Error).message}`]);
  }
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new DataFileError(file, [`not valid JSON: ${(cause as Error).message}`]);
  }
}

function parseFile<S extends z.ZodType>(dir: string, file: string, schema: S): z.infer<S> {
  const result = schema.safeParse(readJson(dir, file));
  if (!result.success) {
    throw new DataFileError(
      file,
      result.error.issues.map((issue) => `${issue.path.length ? issue.path.join(".") : "(root)"}: ${issue.message}`),
    );
  }
  return result.data;
}

function readPng(dir: string, file: string): Buffer {
  const path = join(dir, file);
  let bytes: Buffer;
  try {
    bytes = readFileSync(path);
  } catch (cause) {
    throw new DataFileError(file, [`cannot read ${path}: ${(cause as Error).message}`]);
  }
  const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) throw new DataFileError(file, ["not a PNG file"]);
  return bytes;
}

export function loadTenantData(dir: string): TenantData {
  const tenant = parseFile(dir, "restaurant.json", Tenant);
  const hours = parseFile(dir, "hours.json", Hours);
  const availability = parseFile(dir, "availability.json", Availability);
  const floorPlanPng = readPng(dir, "floor-plan.png");

  const largestTable = Math.max(...availability.tables.map((t) => t.seats));
  if (tenant.max_party_size > largestTable) {
    throw new DataFileError("restaurant.json", [`max_party_size (${tenant.max_party_size}) is larger than the largest table (${largestTable})`]);
  }

  const kit: RestaurantKit = { vertical: tenant.vertical, menu: parseFile(dir, "menu.json", Menu) };
  return { tenant, hours, availability, floorPlanPng, kit };
}
