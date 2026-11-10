import type { CallToolResult, ToolAnnotations } from "@modelcontextprotocol/server";
import type * as z from "zod";
import type { Clock } from "../clock.js";
import type { TenantData } from "../data/load.js";

/** What every tool handler can use. Passed in, never imported, so tests control it. */
export interface ToolContext {
  data: TenantData;
  clock: Clock;
}

/**
 * One tool, fully described: what the model reads (title, description,
 * schemas, annotations) and what runs (handler). Each tool lives in its own file.
 */
export interface ToolDefinition<Input extends z.ZodObject = z.ZodObject> {
  name: string;
  title: string;
  description: string;
  inputSchema: Input;
  outputSchema?: z.ZodObject;
  annotations: ToolAnnotations;
  handler(input: z.infer<Input>, ctx: ToolContext): Promise<CallToolResult> | CallToolResult;
}

/** Every Passline tool in Phase 0 only reads fictional data. */
export const READ_ONLY: ToolAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

/** Keeps the input type when listing tools of different shapes. */
export const defineTool = <Input extends z.ZodObject>(tool: ToolDefinition<Input>): ToolDefinition<Input> => tool;
