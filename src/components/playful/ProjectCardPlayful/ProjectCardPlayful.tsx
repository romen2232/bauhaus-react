import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { ProjectCardBase } from "../../_base/ProjectCard/ProjectCardBase.js";
import { TagPlayful } from "../TagPlayful/TagPlayful.js";

export type ProjectCardPlayfulProps = Omit<ComponentProps<"a">, "title" | "media"> & {
  href: string;
  color?: FillColor;
  /** Giant drop-cap letter (decorative). */
  initial: string;
  title: string;
  description?: ReactNode;
  /** Tag defaults to ink so it stays visible on any fill. */
  tag?: { label: string; color?: FillColor };
  /** Illustration or image (decorative). */
  media?: ReactNode;
  headingLevel?: 2 | 3;
};

const SLOTS = {
  initial: "font-bh-display text-8xl font-extrabold leading-none",
  title: "font-bh-display text-xl font-bold uppercase",
  description: "font-bh-body text-sm",
  media: "flex flex-1 items-center justify-center",
  arrow: "mt-auto text-2xl",
};

/** Full-bleed color card with a giant initial; the whole card is one link. */
export function ProjectCardPlayful({ color = "orange", tag, ...props }: ProjectCardPlayfulProps) {
  const root = cn(
    "flex min-h-96 flex-col gap-3 rounded-none p-6",
    "hover:shadow-bh-hard-lg motion-safe:transition-[translate,box-shadow] motion-safe:duration-150 motion-safe:hover:-translate-x-1 motion-safe:hover:-translate-y-1",
    FILL_CLASSES[color],
    FOCUS_RING,
  );
  return (
    <ProjectCardBase
      {...props}
      tag={
        tag && (
          <TagPlayful color={tag.color ?? "ink"} className="self-start">
            {tag.label}
          </TagPlayful>
        )
      }
      classes={{ root, ...SLOTS }}
    />
  );
}
