import { describe, expect, it } from "vitest";
import { createLogger } from "../src/log.js";

describe("createLogger", () => {
  it("writes one JSON line with time, level, message and fields", () => {
    const lines: string[] = [];
    const logger = createLogger((line) => lines.push(line), () => new Date("2026-11-10T12:00:00.000Z"));

    logger.log("info", "tool called", { tool: "get_opening_hours", ms: 3 });

    expect(lines).toHaveLength(1);
    expect(lines[0]?.endsWith("\n")).toBe(true);
    expect(JSON.parse(lines[0] ?? "")).toEqual({
      time: "2026-11-10T12:00:00.000Z",
      level: "info",
      message: "tool called",
      tool: "get_opening_hours",
      ms: 3,
    });
  });

  it("writes to stderr by default, never stdout", () => {
    const stdout: string[] = [];
    const stderr: string[] = [];
    const originalOut = process.stdout.write.bind(process.stdout);
    const originalErr = process.stderr.write.bind(process.stderr);
    process.stdout.write = ((chunk: string) => (stdout.push(chunk), true)) as typeof process.stdout.write;
    process.stderr.write = ((chunk: string) => (stderr.push(chunk), true)) as typeof process.stderr.write;
    try {
      createLogger().log("warn", "slow tool");
    } finally {
      process.stdout.write = originalOut;
      process.stderr.write = originalErr;
    }

    expect(stdout).toEqual([]);
    expect(stderr).toHaveLength(1);
  });
});
