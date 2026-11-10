import * as z from "zod";
import { describeFloorPlan } from "../../domain/floor-plan.js";
import { defineTool, READ_ONLY } from "../types.js";

/**
 * Returns the floor plan as MCP image content plus a text description.
 *
 * No outputSchema / structuredContent on purpose: some clients have dropped
 * image blocks when structuredContent was also present, and an image tool
 * doesn't need structured data. The text block carries the same facts.
 */
export const getFloorPlanTool = defineTool({
  name: "get_floor_plan",
  title: "Floor plan",
  description: [
    "Return an image of the restaurant's layout (tables with seat counts, bar, terrace, private room) plus the same layout as text.",
    "Use when the guest asks where they would sit, about the terrace or the private room, how big the tables are, or wants to see the layout.",
    "Do NOT use to check whether a table is free; use check_availability for that.",
    "Input: none. Send {}. The result is a PNG image block and a text block; show the image to the guest when your client can.",
    "Example: {}",
  ].join("\n"),
  inputSchema: z.object({}),
  annotations: { ...READ_ONLY },
  handler(_input, { data }) {
    const layout = describeFloorPlan(data.availability);
    return {
      content: [
        { type: "image", data: data.floorPlanPng.toString("base64"), mimeType: "image/png" },
        { type: "text", text: `${data.tenant.name} floor plan. ${layout} ${data.tenant.sandbox_notice}` },
      ],
    };
  },
});
