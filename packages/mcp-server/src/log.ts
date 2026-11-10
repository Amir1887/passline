/**
 * Logger for the MCP server.
 *
 * Over stdio, stdout carries the JSON-RPC protocol stream: anything else
 * written there corrupts it and the client silently drops the server.
 * So every log line goes to stderr, as one JSON object per line.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogFields = Record<string, unknown>;

export interface Logger {
  log(level: LogLevel, message: string, fields?: LogFields): void;
}

type Write = (line: string) => void;

const writeToStderr: Write = (line) => {
  process.stderr.write(line);
};

export function createLogger(write: Write = writeToStderr, now: () => Date = () => new Date()): Logger {
  return {
    log(level, message, fields = {}) {
      write(JSON.stringify({ time: now().toISOString(), level, message, ...fields }) + "\n");
    },
  };
}
