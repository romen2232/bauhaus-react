import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";

export type TextLinkArrow = "right" | "up-right" | "down";

const GLYPHS: Record<TextLinkArrow, string> = {
  right: "→",
  "up-right": "↗",
  down: "↓",
};

export type TextLinkBaseProps = ComponentProps<"a"> & {
  href: string;
  /** Optional trailing arrow; decorative, so it never joins the accessible name. */
  arrow?: TextLinkArrow;
  classes: { root: string; arrow: string };
};

/** Internal: inline text link with an optional trailing arrow. */
export function TextLinkBase({ arrow, classes, className, children, ...props }: TextLinkBaseProps) {
  return (
    <a className={cn(classes.root, className)} {...props}>
      {children}
      {arrow && (
        <span aria-hidden="true" className={classes.arrow}>
          {GLYPHS[arrow]}
        </span>
      )}
    </a>
  );
}
