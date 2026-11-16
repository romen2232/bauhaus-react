import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

/** Text colours allowed for giant numerals. Yellow is excluded: it fails contrast as text. */
export type NumberColor = "ink" | "red" | "blue";

export type BigNumberProps = Omit<ComponentProps<"div">, "color"> & {
  value: ReactNode;
  label?: ReactNode;
  caption?: ReactNode;
  color?: NumberColor;
};

const COLORS: Record<NumberColor, string> = {
  ink: "text-bh-ink",
  red: "text-bh-red",
  blue: "text-bh-blue",
};

/** A numeral as the hero: optional label above, caption below. */
export function BigNumber({ value, label, caption, color = "ink", className, ...props }: BigNumberProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {label !== undefined && <p className="font-bh-body text-xs uppercase tracking-[0.1em]">{label}</p>}
      <p className={cn("font-bh-display text-7xl leading-none tabular-nums", COLORS[color])}>{value}</p>
      {caption !== undefined && <p className="font-bh-body text-sm text-bh-muted-text">{caption}</p>}
    </div>
  );
}
