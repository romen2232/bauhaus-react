import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn";

export type HighlightTextProps = ComponentProps<"p">;
export type HighlightMarkProps = ComponentProps<"strong">;

function Mark({ className, ...props }: HighlightMarkProps) {
  return <strong className={cn("font-[inherit] text-bh-ink", className)} {...props} />;
}

/** Muted paragraph where `HighlightText.Mark` children stand out in ink (Manifesto reading pattern). */
export function HighlightText({ className, ...props }: HighlightTextProps) {
  return <p className={cn("font-bh-body text-bh-muted-text", className)} {...props} />;
}

HighlightText.Mark = Mark;
