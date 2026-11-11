import type { ToolCatalogEntry } from "passline-mcp/tools";

export interface ToolCard {
  name: string;
  title: string;
  /** The first line of the model-facing description: what the tool returns. */
  summary: string;
  /** The "Use when …" line, shown so visitors see how the model is guided. */
  useWhen: string;
  kit: "core" | "restaurant";
}

export function toToolCards(catalog: ToolCatalogEntry[]): ToolCard[] {
  return catalog.map((tool) => {
    const lines = tool.description.split("\n");
    return {
      name: tool.name,
      title: tool.title,
      summary: lines[0] ?? "",
      useWhen: lines.find((line) => line.startsWith("Use when")) ?? "",
      kit: tool.kit,
    };
  });
}
