import type { ReactNode } from "react";
import type { SingleLook } from "../look/LookContext";
import { CopyButton } from "../shell/CopyButton";

export type RowSpec = {
  id: string;
  label: string;
  look: SingleLook | null;
  exportNames: string[];
  snippet: string;
  demo: ReactNode;
};

// One corner style per row (spec §4.1): Soft owns its rounded container, the rest stay sharp.
const ROOT: Record<SingleLook | "agnostic", string> = {
  playful: "border-2 border-bh-ink bg-bh-paper",
  swiss: "border border-bh-ink bg-bh-paper-white",
  soft: "overflow-hidden rounded-bh-soft bg-bh-sand",
  agnostic: "border border-bh-ink bg-bh-paper-white",
};
const CODE: Record<SingleLook | "agnostic", string> = {
  playful: "bg-bh-ink text-bh-paper",
  swiss: "bg-bh-ink text-bh-paper",
  soft: "bg-bh-charcoal text-bh-paper",
  agnostic: "bg-bh-ink text-bh-paper",
};
const MARK: Record<SingleLook | "agnostic", string> = { playful: "■", swiss: "▬", soft: "●", agnostic: "◆" };

/** One look of a component: live demo on the left, code on the right. */
export function LookRow({ row, large }: { row: RowSpec; large: boolean }) {
  const key = row.look ?? "agnostic";
  return (
    <section
      data-testid="look-row"
      aria-label={row.label}
      data-size={large ? "large" : "normal"}
      id={`row-${row.id}`}
      className={`scroll-mt-24 ${ROOT[key]}`}
    >
      <header className="flex items-baseline justify-between gap-4 px-4 py-2 font-bh-mono text-xs uppercase tracking-[0.1em]">
        <span>
          <span aria-hidden="true">{MARK[key]} </span>
          {row.label}
        </span>
        <code className="normal-case">{row.exportNames.join(", ")}</code>
      </header>
      <div className="grid md:grid-cols-2">
        <div data-testid="demo" className={`flex flex-wrap items-center gap-4 p-6 ${large ? "min-h-72 p-10" : "min-h-40"}`}>{row.demo}</div>
        <div className={`relative ${CODE[key]}`}>
          <pre className="overflow-x-auto p-4 font-bh-mono text-xs leading-relaxed">
            <code>{row.snippet}</code>
          </pre>
          <CopyButton text={row.snippet} className="absolute right-3 top-3 font-bh-mono text-[11px] uppercase tracking-[0.1em] underline underline-offset-4" />
        </div>
      </div>
    </section>
  );
}
