import { useState } from "react";

/** Copies `text` to the clipboard and says so. Fails silently when the clipboard is blocked. */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label="Copy to clipboard"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard blocked: the text stays selectable.
        }
      }}
      className={className ?? "font-bh-mono text-xs uppercase tracking-[0.1em] underline underline-offset-4"}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
