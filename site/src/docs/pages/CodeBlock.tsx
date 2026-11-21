import { CopyButton } from "../../shell/CopyButton";

/** A copyable code sample. */
export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <figure className="relative my-4">
      {label && <figcaption className="mb-1 font-bh-mono text-xs uppercase tracking-[0.1em] text-bh-muted-text">{label}</figcaption>}
      <pre className="overflow-x-auto border-2 border-bh-ink bg-bh-ink p-4 pr-16 font-bh-mono text-xs leading-relaxed text-bh-paper">
        <code>{code}</code>
      </pre>
      <CopyButton text={code} className="absolute right-3 top-3 font-bh-mono text-[11px] uppercase tracking-[0.1em] text-bh-paper underline underline-offset-4" />
    </figure>
  );
}
