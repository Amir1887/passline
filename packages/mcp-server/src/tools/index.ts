/**
 * The tool list: core tools for any business, plus the kit for the tenant's
 * vertical. Adding a tool = a new file + one line here.
 */
import type { Tenant } from "../data/schemas.js";
import { checkAvailabilityTool } from "./core/check-availability.js";
import { getFloorPlanTool } from "./core/get-floor-plan.js";
import { getOpeningHours } from "./core/get-opening-hours.js";
import { checkAllergensTool } from "./restaurant/check-allergens.js";
import { searchMenuTool } from "./restaurant/search-menu.js";
import type { ToolDefinition } from "./types.js";

// Each list mixes tools with different input shapes; `any` keeps them in one array.
type AnyTool = ToolDefinition<any>;

export const coreTools: AnyTool[] = [getOpeningHours, checkAvailabilityTool, getFloorPlanTool];

export const kitTools: Record<Tenant["vertical"], AnyTool[]> = {
  restaurant: [searchMenuTool, checkAllergensTool],
};

export function toolsFor(vertical: Tenant["vertical"]): AnyTool[] {
  return [...coreTools, ...kitTools[vertical]];
}
