/**
 * createServer() builds one MCP server instance for one tenant.
 *
 * It's a factory on purpose: stdio (Phase 0) calls it through serveStdio(),
 * and the remote HTTP server (Phase 6) will call the same factory through
 * createMcpHandler(), with no change to the tools.
 */
import { McpServer } from "@modelcontextprotocol/server";
import { systemClock, type Clock } from "./clock.js";
import type { TenantData } from "./data/load.js";
import { createLogger, type Logger } from "./log.js";
import { runTool } from "./results.js";
import { toolsFor } from "./tools/index.js";

export const SERVER_NAME = "passline";
export const SERVER_VERSION = "0.1.0";

export interface ServerDeps {
  data: TenantData;
  clock?: Clock;
  logger?: Logger;
}

export function createServer({ data, clock = systemClock, logger = createLogger() }: ServerDeps): McpServer {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      capabilities: { tools: {} },
      instructions: `Tools for ${data.tenant.name}, a fictional demo restaurant. All data is fictional; say so when it matters. Never promise that food is safe for an allergy: pass on the staff note.`,
    },
  );

  const ctx = { data, clock };
  for (const tool of toolsFor(data.tenant.vertical)) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        ...(tool.outputSchema ? { outputSchema: tool.outputSchema } : {}),
        annotations: { title: tool.title, ...tool.annotations },
      },
      (input: unknown) => runTool(tool.name, logger, () => tool.handler(input, ctx)),
    );
  }
  return server;
}
