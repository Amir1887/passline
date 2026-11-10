#!/usr/bin/env node
/**
 * Entry point: `npx passline-mcp`. An MCP client (Claude Desktop, Claude Code,
 * Cursor, MCP Inspector) starts this process and talks to it over stdio.
 * stdout is reserved for the protocol; logs go to stderr.
 */
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { loadTenantData } from "./data/load.js";
import { createLogger } from "./log.js";
import { resolveDataDir } from "./paths.js";
import { createServer, SERVER_VERSION } from "./server.js";

const logger = createLogger();

try {
  const dataDir = resolveDataDir();
  const data = loadTenantData(dataDir);
  serveStdio(() => createServer({ data, logger }), {
    onerror: (error) => logger.log("error", "transport error", { error: error.message }),
  });
  logger.log("info", "passline-mcp started", { version: SERVER_VERSION, tenant: data.tenant.id, dataDir });
} catch (error) {
  logger.log("error", "passline-mcp failed to start", { error: error instanceof Error ? error.message : String(error) });
  process.exitCode = 1;
}
