import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FOCUS_RING, SWISS_DISPLAY, SWISS_MOTION } from "../../../lib/styles.js";
import { ProjectCardBase } from "../../_base/ProjectCard/ProjectCardBase.js";
import { TagSwiss } from "../TagSwiss/TagSwiss.js";

export type ProjectCardSwissProps = Omit<ComponentProps<"a">, "title" | "media"> & {
  href: string;
  /** Giant decorative initial. */
  initial: string;
  title: string;
  description?: ReactNode;
  tag?: { label: string };
  /** Illustration or image (decorative). */
  media?: ReactNode;
  headingLevel?: 2 | 3;
};

const ROOT = cn(
  "group flex min-h-96 flex-col gap-3 border border-bh-rule bg-transparent p-6 text-bh-ink hover:border-bh-ink",
  SWISS_MOTION,
  FOCUS_RING,
);

const INITIAL = cn(
  "text-9xl leading-none text-bh-muted-text group-hover:text-bh-ink",
  SWISS_DISPLAY,
  SWISS_MOTION,
);

const SLOTS = {
  title: cn("text-xl group-hover:underline decoration-1 underline-offset-4", SWISS_DISPLAY),
  description: "font-bh-grotesk text-sm text-bh-muted-text",
  media: "flex flex-1 items-center justify-center",
  arrow: "mt-auto text-2xl",
};

/** Swiss ruled project card with a giant initial and colour-only emphasis. */
export function ProjectCardSwiss({ tag, ...props }: ProjectCardSwissProps) {
  return (
    <ProjectCardBase
      {...props}
      tag={tag && <TagSwiss className="self-start">{tag.label}</TagSwiss>}
      includeVisibleTextInName
      classes={{ root: ROOT, initial: INITIAL, ...SLOTS }}
    />
  );
}
