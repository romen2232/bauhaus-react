import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type ProjectCardBaseClasses = {
  root: string;
  initial: string;
  title: string;
  description: string;
  media: string;
  arrow: string;
};

export type ProjectCardBaseProps = Omit<ComponentProps<"a">, "title" | "media"> & {
  href: string;
  /** Giant drop-cap letter (decorative). */
  initial: string;
  title: string;
  description?: ReactNode;
  /** A look's Tag element, rendered as given. */
  tag?: ReactNode;
  /** Illustration or image (decorative). */
  media?: ReactNode;
  headingLevel?: 2 | 3;
  /** Derive the link name from visible content instead of the title alone. */
  includeVisibleTextInName?: boolean;
  classes: ProjectCardBaseClasses;
};

/** Internal: a card that is one link, named by its title. */
export function ProjectCardBase({
  href,
  initial,
  title,
  description,
  tag,
  media,
  headingLevel = 3,
  includeVisibleTextInName = false,
  classes,
  className,
  ...props
}: ProjectCardBaseProps) {
  const titleId = useId();
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <a
      href={href}
      aria-labelledby={includeVisibleTextInName ? undefined : titleId}
      className={cn(classes.root, className)}
      {...props}
    >
      {tag}
      <span aria-hidden="true" className={classes.initial}>
        {initial}
      </span>
      <Heading id={titleId} className={classes.title}>
        {title}
      </Heading>
      {description && <div className={classes.description}>{description}</div>}
      {media && (
        <div aria-hidden="true" className={classes.media}>
          {media}
        </div>
      )}
      <span aria-hidden="true" className={classes.arrow}>
        →
      </span>
    </a>
  );
}
