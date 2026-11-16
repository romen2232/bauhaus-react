import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn";

export type DisplayHeadingSize = "xl" | "2xl" | "3xl" | "4xl";

export type DisplayHeadingProps = ComponentProps<"h1"> & {
  as?: "h1" | "h2" | "h3";
  size?: DisplayHeadingSize;
  /** Draw an offset copy behind the text (Modulo "GRAPHIC DESIGN" effect). Decorative only. */
  echo?: boolean;
};

const SIZES: Record<DisplayHeadingSize, string> = {
  xl: "text-4xl md:text-5xl",
  "2xl": "text-5xl md:text-7xl",
  "3xl": "text-6xl md:text-8xl",
  "4xl": "text-7xl md:text-9xl",
};

/** Giant geometric display heading. */
export function DisplayHeading({
  as: Tag = "h2",
  size = "2xl",
  echo = false,
  className,
  children,
  ...props
}: DisplayHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-bh-display font-extrabold uppercase leading-[0.9] tracking-tight",
        SIZES[size],
        echo && "relative isolate",
        className,
      )}
      {...props}
    >
      {echo ? (
        <>
          <span aria-hidden="true" className="absolute left-0 top-[0.12em] -z-10 text-bh-sky select-none">
            {children}
          </span>
          {children}
        </>
      ) : (
        children
      )}
    </Tag>
  );
}
