import type { ReactNode } from "react";

/** Shared page frame for the hand-written docs pages. */
export function Page({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4 px-4 py-8 md:px-8">
      <h1 className="font-bh-display text-5xl font-extrabold tracking-[-0.03em] md:text-7xl">{title}</h1>
      {lead && <p className="text-lg text-bh-charcoal">{lead}</p>}
      {children}
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-6 font-bh-grotesk text-2xl tracking-[-0.02em]">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed text-bh-charcoal">{children}</p>;
}
