import { useId, type ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";

export type StampProps = Omit<ComponentProps<"div">, "color"> & {
  text: string;
  color?: FillColor;
  /** Slow continuous rotation; disabled for users who prefer reduced motion. */
  spin?: boolean;
};

const CIRCLE_PATH = "M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0";

/** Circular rotating text badge (Mijonju "OPEN SOURCE MINDSET"). Size it with className. */
export function Stamp({ text, color = "yellow", spin = false, className, ...props }: StampProps) {
  // useId output can contain characters that break url(#id) references; keep it alphanumeric.
  const pathId = `bh-stamp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <div
      role="img"
      aria-label={text}
      className={cn("inline-block size-32 rounded-full border-2 border-current", FILL_CLASSES[color], className)}
      {...props}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className={cn("size-full", spin && "motion-safe:animate-bh-spin")}
      >
        <path id={pathId} d={CIRCLE_PATH} fill="none" />
        <text className="fill-current font-bh-display text-[10px] font-bold uppercase tracking-[0.2em]">
          <textPath href={`#${pathId}`}>{`${text} · `}</textPath>
        </text>
      </svg>
    </div>
  );
}
