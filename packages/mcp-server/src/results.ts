/**
 * One result and error shape for every tool.
 *
 * - Success: JSON text for any client, plus `structuredContent` that the SDK
 *   validates against the tool's outputSchema.
 * - Bad input the model can fix: `isError: true` with "Invalid input: … Fix: …",
 *   so the model can correct its call instead of the server crashing.
 * - Anything unexpected: logged to stderr with a request id; the model gets a
 *   short generic error and no internals.
 */
import type { CallToolResult } from "@modelcontextprotocol/server";
import type { Logger } from "./log.js";

export const TOOL_TIMEOUT_MS = 2_000;

/** A problem with the tool arguments that the caller can fix. */
export class ToolInputError extends Error {
  constructor(
    message: string,
    readonly fix?: string,
  ) {
    super(message);
    this.name = "ToolInputError";
  }
}

class ToolTimeoutError extends Error {
  constructor(ms: number) {
    super(`timed out after ${ms} ms`);
    this.name = "ToolTimeoutError";
  }
}

export function okJson<T extends Record<string, unknown>>(output: T): CallToolResult {
  return { content: [{ type: "text", text: JSON.stringify(output) }], structuredContent: output };
}

export function inputError(error: ToolInputError): CallToolResult {
  const fix = error.fix ? ` Fix: ${error.fix}` : "";
  return { content: [{ type: "text", text: `Invalid input: ${error.message}${fix}` }], isError: true };
}

export function failure(requestId: string): CallToolResult {
  return {
    content: [{ type: "text", text: `The tool failed unexpectedly (request ${requestId}). Please try again, or tell the guest to ask staff.` }],
    isError: true,
  };
}

async function withTimeout<T>(work: () => Promise<T> | T, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ToolTimeoutError(ms)), ms);
  });
  try {
    return await Promise.race([Promise.resolve().then(work), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

let counter = 0;
const nextRequestId = () => `${Date.now().toString(36)}-${(++counter).toString(36)}`;

/** Runs a tool handler with a timeout, consistent errors and one log line per call. */
export async function runTool(
  tool: string,
  logger: Logger,
  work: () => Promise<CallToolResult> | CallToolResult,
  timeoutMs: number = TOOL_TIMEOUT_MS,
): Promise<CallToolResult> {
  const requestId = nextRequestId();
  const started = performance.now();
  const ms = () => Math.round(performance.now() - started);
  try {
    const result = await withTimeout(work, timeoutMs);
    logger.log("info", "tool call", { tool, requestId, ms: ms(), isError: result.isError === true });
    return result;
  } catch (error) {
    if (error instanceof ToolInputError) {
      logger.log("info", "tool call rejected input", { tool, requestId, ms: ms(), reason: error.message });
      return inputError(error);
    }
    logger.log("error", "tool call failed", { tool, requestId, ms: ms(), error: error instanceof Error ? error.message : String(error) });
    return failure(requestId);
  }
}
