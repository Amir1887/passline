import { describe, expect, it } from "vitest";
import type { LogFields, LogLevel } from "../src/log.js";
import { okJson, runTool, ToolInputError } from "../src/results.js";

function recordingLogger() {
  const entries: Array<{ level: LogLevel; message: string; fields: LogFields }> = [];
  return { entries, log: (level: LogLevel, message: string, fields: LogFields = {}) => entries.push({ level, message, fields }) };
}

describe("runTool", () => {
  it("passes a success through and logs one line", async () => {
    const logger = recordingLogger();
    const result = await runTool("demo", logger, () => okJson({ ok: true }));
    expect(result).toEqual({ content: [{ type: "text", text: '{"ok":true}' }], structuredContent: { ok: true } });
    expect(logger.entries).toEqual([{ level: "info", message: "tool call", fields: expect.objectContaining({ tool: "demo", isError: false }) }]);
  });

  it("turns a ToolInputError into an isError result with a Fix hint", async () => {
    const result = await runTool("demo", recordingLogger(), () => {
      throw new ToolInputError("party_size must be 12 or fewer.", "tell the guest to ask staff about private dining.");
    });
    expect(result).toEqual({
      content: [{ type: "text", text: "Invalid input: party_size must be 12 or fewer. Fix: tell the guest to ask staff about private dining." }],
      isError: true,
    });
  });

  it("hides unexpected errors from the model but logs them with a request id", async () => {
    const logger = recordingLogger();
    const result = await runTool("demo", logger, () => {
      throw new Error("database password is hunter2");
    });
    expect(result.isError).toBe(true);
    expect(JSON.stringify(result)).not.toMatch(/hunter2/);
    const [entry] = logger.entries;
    expect(entry).toMatchObject({ level: "error", fields: { error: "database password is hunter2" } });
    expect(JSON.stringify(result)).toContain(String(entry?.fields.requestId));
  });

  it("times out a slow handler instead of hanging the client", async () => {
    const logger = recordingLogger();
    const result = await runTool("demo", logger, () => new Promise(() => undefined), 50);
    expect(result.isError).toBe(true);
    expect(logger.entries[0]).toMatchObject({ level: "error", fields: { error: "timed out after 50 ms" } });
  });
});
