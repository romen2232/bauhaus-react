import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { SOFT_HOVER_CLASSES, SOFT_TONE_CLASSES, type SoftTone } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { ProjectCardBase } from "../../_base/ProjectCard/ProjectCardBase.js";
import { TagSoft } from "../TagSoft/TagSoft.js";

export type ProjectCardSoftProps = Omit<ComponentProps<"a">, "title" | "media"> & {
  href: string;
  /** Tone of the header block; encodes category. */
  tone?: SoftTone;
  /** Large initial shown in the header block (decorative). */
  initial: string;
  title: string;
  description?: ReactNode;
  tag?: { label: string; tone?: SoftTone };
  /** Image or illustration, shown in black and white (decorative). */
  media?: ReactNode;
  headingLevel?: 2 | 3;
};

const SLOTS = {
  title: "px-6 pt-4 font-bh-display text-xl font-normal",
  description: "px-6 font-bh-body text-sm",
  media: "flex flex-1 items-center justify-center px-6 grayscale",
  arrow: "mt-auto px-6 pb-6 text-2xl",
};

const ROOT = cn(
  "relative flex min-h-96 flex-col gap-2 overflow-hidden rounded-bh-soft bg-bh-sand text-bh-ink motion-safe:transition-colors motion-safe:duration-200 motion-safe:ease-out",
  SOFT_HOVER_CLASSES.sand,
  FOCUS_RING,
);

const INITIAL = "flex h-40 items-end p-6 font-bh-display text-8xl font-light leading-none";

/** Soft card with a tone header block and black-and-white media; the whole card is one link. */
export function ProjectCardSoft({ tone = "blue", tag, ...props }: ProjectCardSoftProps) {
  return (
    <ProjectCardBase
      {...props}
      tag={
        tag && (
          <TagSoft tone={tag.tone ?? "neutral"} className="absolute top-4 left-4">
            {tag.label}
          </TagSoft>
        )
      }
      classes={{ root: ROOT, initial: cn(INITIAL, SOFT_TONE_CLASSES[tone]), ...SLOTS }}
    />
  );
}
