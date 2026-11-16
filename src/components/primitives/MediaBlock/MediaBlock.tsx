import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn.js";
import { BG_CLASSES, type FillColor } from "../../../lib/palette.js";

export type MediaBlockProps = Omit<ComponentProps<"div">, "color"> & {
  src: string;
  alt: string;
  color?: FillColor;
};

/** Black-and-white image placed over a flat colour block (aboutUs, Mobile). */
export function MediaBlock({ src, alt, color = "blue", className, ...props }: MediaBlockProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div aria-hidden="true" className={cn("absolute inset-x-0 top-1/4 bottom-0", BG_CLASSES[color])} />
      <img src={src} alt={alt} className="relative block w-full object-cover grayscale" />
    </div>
  );
}
