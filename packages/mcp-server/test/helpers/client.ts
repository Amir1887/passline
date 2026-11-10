/**
 * Drives a real MCP Client against createServer() in-process, the way the
 * SDK v2 testing guide recommends: createMcpHandler + handler.fetch, no port.
 */
import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { fixedClock } from "../../src/clock.js";
import { loadTenantData } from "../../src/data/load.js";
import type { Logger } from "../../src/log.js";
import { createServer } from "../../src/server.js";

export const DATA_DIR = fileURLToPath(new URL("../../../../data/thymewick/", import.meta.url));
export const silentLogger: Logger = { log: () => undefined };

/** Tuesday 10 Nov 2026, 15:00 in New York. */
export const DEFAULT_NOW = "2026-11-10T20:00:00Z";

export async function connectClient(nowIso: string = DEFAULT_NOW): Promise<Client> {
  const data = loadTenantData(DATA_DIR);
  const handler = createMcpHandler(() => createServer({ data, clock: fixedClock(nowIso), logger: silentLogger }));
  const transport = new StreamableHTTPClientTransport(new URL("http://test.local/mcp"), {
    fetch: (url, init) => handler.fetch(new Request(url, init)),
  });
  const client = new Client({ name: "passline-test", version: "1.0.0" }, { versionNegotiation: { mode: "auto" } });
  await client.connect(transport);
  return client;
}

/** The text of the first content block. */
export function textOf(result: { content?: unknown }): string {
  const first = (result.content as Array<{ type: string; text?: string }> | undefined)?.[0];
  return first?.type === "text" ? (first.text ?? "") : "";
}
