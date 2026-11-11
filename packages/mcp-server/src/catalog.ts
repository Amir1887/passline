/**
 * The public, read-only view of the tool list: what each tool is called and
 * what the model is told about it. The website builds from this at build time,
 * so the page and the server can never disagree about the tools.
 */
import type { Tenant } from "./data/schemas.js";
import { coreTools, kitTools } from "./tools/index.js";

export interface ToolCatalogEntry {
  name: string;
  title: string;
  description: string;
  kit: "core" | Tenant["vertical"];
  readOnly: boolean;
}

export function toolCatalog(vertical: Tenant["vertical"] = "restaurant"): ToolCatalogEntry[] {
  const entry = (kit: ToolCatalogEntry["kit"]) => (tool: (typeof coreTools)[number]): ToolCatalogEntry => ({
    name: tool.name,
    title: tool.title,
    description: tool.description,
    kit,
    readOnly: tool.annotations.readOnlyHint === true,
  });
  return [...coreTools.map(entry("core")), ...kitTools[vertical].map(entry(vertical))];
}
