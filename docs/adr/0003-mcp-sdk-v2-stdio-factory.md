# 0003. MCP SDK v2, stdio first, one server factory

Date: 2026-11-10 · Status: Accepted

## Context

Phase 0 ships a public MCP server so Upwork clients can see working tools, the way tool descriptions are written, and an image result. Phase 6 will turn the same server into a remote, authenticated HTTP service. The MCP TypeScript SDK has two lines: v1 (`@modelcontextprotocol/sdk`, 1.32.x, maintenance only) and v2 (`@modelcontextprotocol/server` / `client`, 2.4.0, the current stable line for the 2026-07-28 protocol, needing Node 20+ and Zod 4). Popular desktop clients may still speak the 2025-era protocol.

## Decision

- Use **SDK v2** (`@modelcontextprotocol/server` 2.4.0, Zod 4).
- Ship **stdio** first. The client starts the server as a subprocess; no hosting or credentials are needed.
- Build the server as a **factory**, `createServer({ data, clock, logger })`. `serveStdio(factory)` uses it now; `createMcpHandler(factory)` will expose the same tools over HTTP in Phase 6.
- Rely on `serveStdio`'s default `legacy: "serve"`, so 2025-era clients connect too. A test performs a raw 2025-era `initialize` handshake over real stdio.
- One result/error shape (`runTool`): JSON text + `structuredContent`, or `isError` with "Invalid input: … Fix: …"; a 2 s timeout; unexpected errors are logged with a request id and never leak internals.
- Logs go to stderr only. A test bans `console.*` in source, and another spawns the CLI to prove stdout carries only JSON-RPC.

## Alternatives considered

- **SDK v1 (1.32.x):** widely used and stable, but in maintenance; we'd migrate later anyway. Kept as the fallback if a target client couldn't negotiate with v2. The legacy handshake test passed, so it wasn't needed.
- **Remote HTTP first:** needs hosting, auth and abuse limits before anyone can try a single tool. Deferred to Phase 6.
- **In-memory transport for all tests:** the v2 docs limit `InMemoryTransport.createLinkedPair` to 2025-era instances, and it can't catch stdout corruption. We use `createMcpHandler` + `handler.fetch` in-process, plus real-subprocess stdio tests.
- **A plugin framework for tools:** not justified by 5 tools. Tools are plain `defineTool({…})` objects in a list per vertical.

## Consequences

- Easier: one factory for both transports; the tests cover modern and legacy clients; the model gets errors it can act on.
- Harder: Node 20+ is required; SDK v2 is newer, so examples online often show the v1 API.
- Follow-up: confirm Claude Desktop and Cursor by hand in PR 6 (screenshots), and publish `passline-mcp` to npm.
