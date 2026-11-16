import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../../lib/cn.js";
import { FILL_CLASSES, type FillColor } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
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

/** Full-bleed color card with a giant initial; the whole card is one link. */
export function ProjectCardPlayful({
  href,
  color = "orange",
  initial,
  title,
  description,
  tag,
  media,
  headingLevel = 3,
  className,
  ...props
}: ProjectCardPlayfulProps) {
  const titleId = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <a
      href={href}
      aria-labelledby={titleId}
      className={cn(
        "flex min-h-96 flex-col gap-3 rounded-none p-6",
        "hover:shadow-bh-hard-lg motion-safe:transition-[translate,box-shadow] motion-safe:duration-150 motion-safe:hover:-translate-x-1 motion-safe:hover:-translate-y-1",
        FILL_CLASSES[color],
        FOCUS_RING,
        className,
      )}
      {...props}
    >
      {tag && (
        <TagPlayful color={tag.color ?? "ink"} className="self-start">
          {tag.label}
        </TagPlayful>
      )}
      <span aria-hidden="true" className="font-bh-display text-8xl font-extrabold leading-none">
        {initial}
      </span>
      <Heading id={titleId} className="font-bh-display text-xl font-bold uppercase">
        {title}
      </Heading>
      {description && <div className="font-bh-body text-sm">{description}</div>}
      {media && (
        <div aria-hidden="true" className="flex flex-1 items-center justify-center">
          {media}
        </div>
      )}
      <span aria-hidden="true" className="mt-auto text-2xl">
        →
      </span>
    </a>
  );
}
