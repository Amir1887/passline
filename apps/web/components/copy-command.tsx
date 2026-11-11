"use client";

import { useState } from "react";

/** A command with a Copy button. Falls back to selecting the text if the clipboard is blocked. */
export function CopyCommand({ command, label }: { command: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "select">("idle");

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const code = event.currentTarget.parentElement?.querySelector("code");
    try {
      await navigator.clipboard.writeText(command);
      setState("copied");
    } catch {
      if (code) window.getSelection()?.selectAllChildren(code);
      setState("select");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-2 pl-4 shadow-lift">
      <span className="font-mono text-sm text-muted-foreground select-none" aria-hidden>
        $
      </span>
      <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm">{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className="shrink-0 rounded-[10px] bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
      >
        {state === "copied" ? "Copied" : state === "select" ? "Press Ctrl+C" : "Copy"}
      </button>
    </div>
  );
}
