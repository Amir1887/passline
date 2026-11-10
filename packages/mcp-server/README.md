# passline-mcp

An MCP server for **Thymewick**, a fictional demo restaurant. It gives any MCP client (Claude Desktop, Claude Code, Cursor, MCP Inspector) read-only tools for opening hours, and — in the next releases — menu search, allergens, table availability and a floor-plan image.

> **All data is fictional.** Thymewick is not a real restaurant. Every tool result says so.
>
> **Status:** Phase 0 in progress. Available now: `get_opening_hours`. Coming next: `search_menu`, `check_allergens`, `check_availability`, `get_floor_plan`.

## Flow

```mermaid
sequenceDiagram
  participant C as MCP client<br/>(Claude Desktop, Cursor…)
  participant S as passline-mcp<br/>(stdio subprocess)
  participant D as data/thymewick/*.json
  C->>S: starts `node dist/cli.js`
  S->>D: loadTenantData() + Zod validation
  alt data invalid
    S-->>C: exit 1 (reason on stderr, stdout stays clean)
  end
  C->>S: initialize (2025-era or 2026 protocol)
  C->>S: tools/list
  S-->>C: tools with title, description, input/output schema, read-only hints
  C->>S: tools/call get_opening_hours {"day":"friday"}
  S->>S: SDK validates input (Zod) → handler → runTool (2 s timeout, log to stderr)
  S-->>C: JSON text + structuredContent<br/>or isError "Invalid input: … Fix: …"
```

The server is a factory, `createServer({ data, clock, logger })`. stdio uses it through `serveStdio()`; the remote HTTP server in Phase 6 will use the same factory through `createMcpHandler()`.

## Tools

| Tool | Title | Input | Returns |
|---|---|---|---|
| `get_opening_hours` | Opening hours | `day` (lowercase weekday) **or** `date` (YYYY-MM-DD), or neither for today | `open`, `opens`, `closes`, `last_seating`, `note` or `reason`, `today`, `timezone`, `sandbox` |

All tools are annotated `readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false`.

## Run it locally

```bash
npm install
npm run build -w passline-mcp
```

**MCP Inspector**: try every tool in the browser:
```bash
npx @modelcontextprotocol/inspector node packages/mcp-server/dist/cli.js
```

**Claude Code**:
```bash
claude mcp add passline -- node /absolute/path/to/passline/packages/mcp-server/dist/cli.js
```

**Claude Desktop** (`claude_desktop_config.json`) and **Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "passline": { "command": "node", "args": ["/absolute/path/to/passline/packages/mcp-server/dist/cli.js"] }
  }
}
```

Once the package is published, `npx -y passline-mcp` will replace the local path.

Set `PASSLINE_DATA_DIR` to point at another folder with the same data files.

## How tool descriptions are written

The model only sees the name, title, description and schemas, so the description does the selling. Each one follows the same rules, and a test (`test/tools/tool-list.test.ts`) enforces them for every tool:

1. **Lead with the job**: one sentence on what the tool returns ("Get…", "Search…", "Check…").
2. **Say when to use it**, using the words guests actually say ("is it open", "last seating", "holidays").
3. **Say when NOT to use it** and name the right tool instead, so the model doesn't pick a near miss.
4. **State formats and units**: `YYYY-MM-DD`, 24-hour `HH:MM`, lowercase weekdays, USD, party size 1–12.
5. **Give one input example**, as JSON.
6. **Validate with Zod and return fixable errors**: bad input comes back as `isError: true` with `Invalid input: … Fix: …`, so the model can correct its next call. The server never crashes on bad input.
7. **Mark results as fictional**, and always pass safety notes through.

## Errors and limits

| Case | Behaviour | Logged as |
|---|---|---|
| Wrong type or format (e.g. `day: "Friday"`) | The SDK rejects it before the handler: `isError: true` naming the field | — |
| Valid types, impossible request (e.g. both `day` and `date`) | `isError: true`, `Invalid input: … Fix: …` | `info` "tool call rejected input" |
| Handler takes longer than 2 s | `isError: true`, generic message with a request id | `error` "timed out after 2000 ms" |
| Unexpected bug | `isError: true`, generic message with a request id; no internals leak | `error` with the real message |
| Data folder invalid or missing | The process exits with code 1; the reason goes to stderr | `error` "failed to start" |

Logs are JSON lines on **stderr only**; stdout carries the MCP protocol. A test fails if any source file calls `console.*`.

## Cost

$0. No AI model, network call or database.

## Code map

| Path | Responsibility |
|---|---|
| `src/cli.ts` | Entry point: loads data, starts `serveStdio` |
| `src/server.ts` | `createServer()`: registers the tools for the tenant's vertical |
| `src/tools/` | One file per tool: name, title, description, Zod schemas, annotations, handler. `core/` for any business, the restaurant kit later |
| `src/domain/` | Pure logic (dates, opening hours), no MCP SDK imports |
| `src/data/` | Zod schemas + loader for `data/<tenant>/` (see [data/README.md](../../data/README.md)) |
| `src/results.ts` | One result/error shape, 2 s timeout, one log line per call |
| `src/log.ts`, `src/clock.ts`, `src/paths.ts` | stderr logger, injectable clock, data-folder lookup |

## How to add a tool

1. Create `src/tools/core/<name>.ts` (any business) or put it in the vertical's kit, using `defineTool({ … })`, with Zod input/output schemas and a description that follows the rules above.
2. Put the logic in `src/domain/` as plain functions.
3. Add the tool to the list in `src/tools/index.ts`.
4. Add `test/tools/<name>.test.ts`: valid input, invalid input, edge cases. The description-rules test picks the new tool up automatically.
5. Update the Tools table above.

## Tests

`npm test -w passline-mcp` builds first, then runs:
- `test/tools/`: tools through a **real MCP client** in-process (SDK `createMcpHandler` + `handler.fetch`), plus description rules
- `test/stdio.test.ts`: spawns the built CLI over **real stdio** with the modern client **and** a 2025-era raw handshake, and checks every stdout line is JSON-RPC
- `test/domain/`, `test/data/`, `test/results.test.ts`: pure logic, data validation, error shape and timeouts

Verified with MCP Inspector 2.14.0 (CLI mode): `tools/list` and `tools/call`.

## Decisions

- [ADR 0002: Tenant data as the single source of truth](../../docs/adr/0002-tenant-data-single-source.md)
- [ADR 0003: MCP SDK v2, stdio first, one server factory](../../docs/adr/0003-mcp-sdk-v2-stdio-factory.md)
