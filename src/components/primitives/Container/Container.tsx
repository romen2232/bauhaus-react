import type { ComponentProps } from "react";
import { cn } from "../../../lib/cn";

export type ContainerProps = ComponentProps<"div"> & {
  as?: "div" | "section" | "main" | "header" | "footer";
};

/** Centered, max-width page container with responsive side gutters. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-7xl px-4 md:px-8", className)} {...props} />;
}
