import { toolCatalog } from "passline-mcp/tools";
import Image from "next/image";
import { CopyCommand } from "@/components/copy-command";
import { toToolCards } from "@/lib/tool-cards";

const GITHUB = "https://github.com/Amir1887/passline";
const NPM = "https://www.npmjs.com/package/passline-mcp";
const SERVER_README = `${GITHUB}/tree/main/packages/mcp-server#readme`;

const DESCRIPTION_RULES = [
  ["Lead with the job", "One sentence on what the tool returns."],
  ["Say when to use it", "In the words guests actually use."],
  ["Say when not to", "And name the right tool instead, so the model doesn't pick a near miss."],
  ["State formats and units", "YYYY-MM-DD, 24-hour HH:MM, USD, party size 1–12."],
  ["Give one example", "A real JSON input inside the description."],
  ["Return errors the model can fix", "Bad input comes back as “Invalid input: … Fix: …”, never a crash."],
  ["Never promise safety", "Allergen answers always carry the staff note."],
] as const;

const ROADMAP = [
  { phase: "0", title: "MCP server", detail: "Five read-only tools, on npm as passline-mcp.", status: "live" },
  { phase: "1", title: "Knowledge desk", detail: "Answers from the restaurant's documents, with the source page.", status: "next" },
  { phase: "2", title: "Bookings", detail: "Availability, create, move and cancel, with clash checks.", status: "planned" },
  { phase: "3", title: "Website widget", detail: "The same answers in a chat bubble on any site.", status: "planned" },
  { phase: "4", title: "WhatsApp", detail: "English and Arabic, opt-out first, staff handoff.", status: "planned" },
  { phase: "5", title: "Payments", detail: "Test deposits, verified webhooks, reconciliation.", status: "planned" },
  { phase: "6", title: "Remote MCP + AI Inspector", detail: "Auth, booking tools, traces and cost per answer.", status: "planned" },
  { phase: "7", title: "Campaigns", detail: "Dry run, approval, CRM sync, safe retries.", status: "planned" },
  { phase: "8", title: "Second restaurant", detail: "Saltquay, team roles, isolated data.", status: "planned" },
] as const;

const CLIENT_CONFIG = `{
  "mcpServers": {
    "passline": { "command": "npx", "args": ["-y", "passline-mcp"] }
  }
}`;

function Dot({ status }: { status: "live" | "next" | "planned" }) {
  const style =
    status === "live"
      ? "bg-success"
      : status === "next"
        ? "bg-card shadow-[inset_0_0_0_2px_var(--primary)]"
        : "bg-card shadow-[inset_0_0_0_1.5px_var(--faint)]";
  return <span aria-hidden className={`relative z-10 mt-1.5 size-[11px] shrink-0 rounded-full ring-4 ring-background ${style}`} />;
}

export default function Home() {
  const tools = toToolCards(toolCatalog());

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <header className="flex items-center justify-between gap-4 py-5">
        <a href="#" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span aria-hidden className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M2 6h12M2 10h12M5 6v4M11 6v4" />
            </svg>
          </span>
          Passline
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm text-muted-foreground">
          <a className="rounded-lg px-3 py-2 hover:bg-card hover:text-foreground" href="#mcp">MCP server</a>
          <a className="hidden rounded-lg px-3 py-2 hover:bg-card hover:text-foreground sm:inline" href="#roadmap">Roadmap</a>
          <a className="rounded-lg px-3 py-2 hover:bg-card hover:text-foreground" href={GITHUB}>GitHub</a>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="grid grid-cols-1 gap-6 py-14 sm:py-20" aria-labelledby="hero">
          <h1 id="hero" className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            An AI front desk for restaurants that shows its sources.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Passline answers guests from a restaurant&apos;s own menu and policies, refuses to guess, and hands allergy
            questions to staff. It&apos;s built in public, one working release at a time. Release 0 is live: an MCP server
            any AI assistant can use.
          </p>
          <div className="grid max-w-xl grid-cols-1 gap-3">
            <CopyCommand label="Claude Code install command" command="claude mcp add passline -- npx -y passline-mcp" />
            <p className="text-sm text-muted-foreground">
              Node.js 20+. No account, API key or network calls. Demo restaurant <b className="font-semibold text-foreground">Thymewick</b>{" "}
              is fictional.
            </p>
          </div>
        </section>

        {/* Proof */}
        <section className="grid grid-cols-1 gap-4 pb-16" aria-labelledby="proof">
          <h2 id="proof" className="text-2xl font-semibold">Tested in a real AI client</h2>
          <p className="max-w-2xl text-muted-foreground">
            Claude Code with the Passline tools: it checks the hours and the allergen data, then answers without promising a
            dish is safe.
          </p>
          <figure className="overflow-hidden rounded-xl border border-border bg-card">
            <Image
              src="/assets/claude-code-passline.png"
              alt="Claude Code answering “Are you open Friday, and is the risotto nut-free?”: open 17:00–23:00; the risotto may contain tree nuts from shared pans; staff must confirm."
              width={942}
              height={830}
              className="h-auto w-full"
              priority
            />
          </figure>
        </section>

        {/* Tools */}
        <section id="mcp" className="grid grid-cols-1 scroll-mt-6 gap-6 pb-16" aria-labelledby="tools">
          <div className="grid gap-2">
            <h2 id="tools" className="text-2xl font-semibold">Five read-only tools</h2>
            <p className="max-w-2xl text-muted-foreground">
              Listed straight from the server&apos;s code, so this page can&apos;t drift from what the AI sees. Core tools work
              for any business; the restaurant kit adds menu and allergens.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tools.map((tool) => (
              <li key={tool.name} className="grid content-start gap-2 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-sm font-medium">{tool.name}</code>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tool.kit === "core" ? "bg-sidebar text-muted-foreground" : "bg-primary-soft text-primary"}`}
                  >
                    {tool.kit === "core" ? "Core" : "Restaurant kit"}
                  </span>
                </div>
                <p className="font-medium">{tool.title}</p>
                <p className="text-sm text-muted-foreground">{tool.summary}</p>
                <p className="text-sm text-muted-foreground">{tool.useWhen}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Description rules */}
        <section className="grid grid-cols-1 gap-6 pb-16" aria-labelledby="rules">
          <div className="grid gap-2">
            <h2 id="rules" className="text-2xl font-semibold">How the tool descriptions are written</h2>
            <p className="max-w-2xl text-muted-foreground">
              The model only sees names, descriptions and schemas, so the description does the work. Every tool follows the
              same seven rules, and a test fails if one doesn&apos;t.
            </p>
          </div>
          <ol className="relative grid gap-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border">
            {DESCRIPTION_RULES.map(([title, detail]) => (
              <li key={title} className="flex gap-3">
                <Dot status="live" />
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Image over MCP */}
        <section className="grid grid-cols-1 gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start" aria-labelledby="image">
          <div className="grid min-w-0 gap-3">
            <h2 id="image" className="text-2xl font-semibold">Images over MCP</h2>
            <p className="text-muted-foreground">
              <code className="font-mono text-sm">get_floor_plan</code> returns the PNG as an image block with its MIME type,
              so clients show it inline, followed by a text block with every table, for models that can&apos;t see images.
              No structured content is sent with it, because some clients drop images when both are present.
            </p>
            <pre className="overflow-x-auto rounded-lg border border-border bg-code p-3 font-mono text-xs leading-relaxed">
              {`{ "content": [
  { "type": "image", "mimeType": "image/png",
    "data": "iVBORw0KGgo…" },
  { "type": "text",
    "text": "Thymewick floor plan. Dining room: T1 (2 seats), …" }
] }`}
            </pre>
          </div>
          <figure className="overflow-hidden rounded-xl border border-border bg-white">
            <Image
              src="/assets/floor-plan.png"
              alt="Thymewick floor plan: dining room with 11 tables, the bar, the kitchen pass, a terrace with two tables, and a private room for up to 12."
              width={1280}
              height={800}
              className="h-auto w-full"
            />
          </figure>
        </section>

        {/* Install */}
        <section className="grid grid-cols-1 gap-4 pb-16" aria-labelledby="install">
          <h2 id="install" className="text-2xl font-semibold">Use it in your AI app</h2>
          <p className="max-w-2xl text-muted-foreground">
            Claude Desktop (Settings → Developer → Edit Config) and Cursor (<code className="font-mono text-sm">.cursor/mcp.json</code>)
            use the same config. On Windows, if the app can&apos;t start <code className="font-mono text-sm">npx</code>, use{" "}
            <code className="font-mono text-sm">&quot;command&quot;: &quot;cmd&quot;, &quot;args&quot;: [&quot;/c&quot;, &quot;npx&quot;, &quot;-y&quot;, &quot;passline-mcp&quot;]</code>.
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-code p-4 font-mono text-sm leading-relaxed">{CLIENT_CONFIG}</pre>
          <p className="text-sm text-muted-foreground">
            Try MCP Inspector: <code className="font-mono">npx @modelcontextprotocol/inspector npx -y passline-mcp</code> ·{" "}
            <a className="text-primary underline underline-offset-4" href={SERVER_README}>
              full setup and design notes
            </a>
          </p>
        </section>

        {/* Roadmap */}
        <section id="roadmap" className="grid grid-cols-1 scroll-mt-6 gap-6 pb-20" aria-labelledby="roadmap-h">
          <h2 id="roadmap-h" className="text-2xl font-semibold">The front desk, one release at a time</h2>
          <ol className="relative grid gap-4 before:absolute before:top-2 before:bottom-2 before:left-[5px] before:w-px before:bg-border">
            {ROADMAP.map((r) => (
              <li key={r.phase} className="flex gap-3">
                <Dot status={r.status} />
                <div>
                  <p className={r.status === "planned" ? "font-medium text-muted-foreground" : "font-medium"}>
                    {r.title} <span className="text-xs text-muted-foreground">· Release {r.phase}</span>
                    {r.status === "live" ? <span className="ml-2 text-xs font-semibold text-success">Live</span> : null}
                    {r.status === "next" ? <span className="ml-2 text-xs font-semibold text-primary">Next</span> : null}
                  </p>
                  <p className="text-sm text-muted-foreground">{r.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border py-6 text-sm text-muted-foreground">
        <span>
          Built by <b className="font-semibold text-foreground">Amir Gad</b>
        </span>
        <a className="hover:text-foreground" href={GITHUB}>GitHub</a>
        <a className="hover:text-foreground" href={NPM}>npm</a>
        <span>MIT license</span>
        <span>All data is fictional. Thymewick is not a real restaurant.</span>
      </footer>
    </div>
  );
}
