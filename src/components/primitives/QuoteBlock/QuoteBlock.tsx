import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type QuoteBlockProps = ComponentProps<"blockquote"> & { cite?: ReactNode };

/** Quotation with an oversized, faded quote mark. Sans only (the BHause serif is not carried over). */
export function QuoteBlock({ cite, className, children, ...props }: QuoteBlockProps) {
  return (
    <blockquote className={cn("relative pt-12 font-bh-display text-3xl leading-tight", className)} {...props}>
      <span aria-hidden="true" className="absolute top-0 left-0 font-bh-display text-8xl leading-none text-bh-muted">
        “
      </span>
      <div className="relative">{children}</div>
      {cite !== undefined && (
        <footer className="mt-6 font-bh-body text-xs uppercase tracking-[0.1em] not-italic">
          <cite className="not-italic">{cite}</cite>
        </footer>
      )}
    </blockquote>
  );
}
