/**
 * End-to-end over real stdio: spawns the built CLI (dist/cli.js) the way
 * Claude Desktop or Cursor would. In-memory tests can't catch a stray write
 * to stdout; these can, because any non-JSON-RPC line breaks the client.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { beforeAll, describe, expect, it } from "vitest";

const CLI = fileURLToPath(new URL("../dist/cli.js", import.meta.url));

beforeAll(() => {
  if (!existsSync(CLI)) throw new Error("dist/cli.js is missing: run `npm run build` first (npm test does this via pretest)");
});

describe("stdio: modern client", () => {
  it("connects, lists tools and calls one through a real subprocess", async () => {
    const client = new Client({ name: "passline-stdio-test", version: "1.0.0" }, { versionNegotiation: { mode: "auto" } });
    await client.connect(new StdioClientTransport({ command: process.execPath, args: [CLI], stderr: "pipe" }));
    try {
      const { tools } = await client.listTools();
      expect(tools.map((t) => t.name)).toContain("get_opening_hours");
      const result = await client.callTool({ name: "get_opening_hours", arguments: { day: "monday" } });
      expect(result.structuredContent).toMatchObject({ open: false, reason: "Closed every Monday" });
    } finally {
      await client.close();
    }
  }, 20_000);
});

describe("stdio: 2025-era client handshake (how older desktop clients connect)", () => {
  it("answers initialize, and every stdout line is a JSON-RPC message", async () => {
    const child = spawn(process.execPath, [CLI], { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    child.stdout.setEncoding("utf8").on("data", (chunk: string) => (stdout += chunk));

    const send = (message: object) => child.stdin.write(JSON.stringify(message) + "\n");
    const waitFor = async (predicate: () => boolean, ms = 10_000) => {
      const start = Date.now();
      while (!predicate()) {
        if (Date.now() - start > ms) throw new Error(`timed out; stdout so far: ${stdout}`);
        await new Promise((r) => setTimeout(r, 25));
      }
    };
    const lines = () => stdout.split("\n").filter((l) => l.trim() !== "");

    try {
      send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "legacy-desktop", version: "1.0.0" } } });
      await waitFor(() => lines().some((l) => l.includes('"id":1')));
      send({ jsonrpc: "2.0", method: "notifications/initialized" });
      send({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_opening_hours", arguments: { day: "friday" } } });
      await waitFor(() => lines().some((l) => l.includes('"id":2')));

      const messages = lines().map((l) => JSON.parse(l)); // throws if any line isn't JSON
      expect(messages.every((m) => m.jsonrpc === "2.0")).toBe(true);
      const init = messages.find((m) => m.id === 1);
      expect(init.result.serverInfo).toMatchObject({ name: "passline" });
      const call = messages.find((m) => m.id === 2);
      expect(call.result.isError).toBeFalsy();
      expect(call.result.structuredContent).toMatchObject({ day: "friday", open: true });
    } finally {
      child.kill();
    }
  }, 20_000);
});

describe("stdio: bad data folder", () => {
  it("refuses to start, explains why on stderr, and writes nothing to stdout", async () => {
    const child = spawn(process.execPath, [CLI], { env: { ...process.env, PASSLINE_DATA_DIR: fileURLToPath(new URL("./", import.meta.url)) }, stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (c: string) => (stdout += c));
    child.stderr.setEncoding("utf8").on("data", (c: string) => (stderr += c));
    const code = await new Promise<number | null>((resolve) => child.on("exit", resolve));
    expect(code).toBe(1);
    expect(stdout).toBe("");
    expect(stderr).toMatch(/failed to start/);
    expect(stderr).toMatch(/restaurant\.json/);
  }, 20_000);
});
