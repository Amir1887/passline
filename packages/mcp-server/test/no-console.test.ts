import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Guard for the stdio transport: console.* writes to stdout and would corrupt
 * the JSON-RPC stream. Server code must log through src/log.ts (stderr) instead.
 */
const srcDir = fileURLToPath(new URL("../src", import.meta.url));

function listTsFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return listTsFiles(path);
    return path.endsWith(".ts") ? [path] : [];
  });
}

describe("server source", () => {
  it("never calls console.* (stdout belongs to the MCP protocol)", () => {
    const offenders = listTsFiles(srcDir).flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((line, index) => ({ file, line: index + 1, text: line }))
        .filter(({ text }) => /\bconsole\.(log|info|debug|warn|error|trace)\s*\(/.test(text)),
    );

    expect(offenders).toEqual([]);
  });
});
