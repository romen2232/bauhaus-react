import type { ComponentProps, ReactNode, Ref } from "react";
import { cn } from "../../../lib/cn.js";

export type CardBaseClasses = { root: string; header: string; body: string; footer: string };

export type CardBaseProps = Omit<ComponentProps<"article">, "title" | "ref"> & {
  header?: ReactNode;
  footer?: ReactNode;
  /** Makes the whole card one link (the root becomes `<a>`). */
  href?: string;
  ref?: Ref<HTMLElement>;
  classes: CardBaseClasses;
};

/** Internal: content panel with header, body and footer slots; an article, or one link with `href`. */
export function CardBase({ header, footer, href, classes, className, children, ref, ...props }: CardBaseProps) {
  const content = (
    <>
      {header !== undefined && <div className={classes.header}>{header}</div>}
      <div className={classes.body}>{children}</div>
      {footer !== undefined && <div className={classes.footer}>{footer}</div>}
    </>
  );
  const root = cn(classes.root, className);

  if (href !== undefined) {
    return (
      <a
        {...(props as ComponentProps<"a">)}
        href={href}
        ref={ref as Ref<HTMLAnchorElement>}
        className={root}
      >
        {content}
      </a>
    );
  }
  return (
    <article {...props} ref={ref} className={root}>
      {content}
    </article>
  );
}
