import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

/** Class slots a look skin fills in. */
export type ButtonBaseClasses = { root: string };

type Shared = {
  classes: ButtonBaseClasses;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

export type ButtonBaseAsButton = Shared & Omit<ComponentProps<"button">, keyof Shared> & { href?: undefined };
export type ButtonBaseAsLink = Shared & Omit<ComponentProps<"a">, keyof Shared> & { href: string };
export type ButtonBaseProps = ButtonBaseAsButton | ButtonBaseAsLink;

/**
 * Internal: behaviour shared by every Button skin. Renders `<a>` when `href` is given.
 * A disabled link drops `href` and `onClick` and is removed from the tab order.
 */
export function ButtonBase(props: ButtonBaseProps) {
  const root = cn(props.classes.root, props.className);

  if (props.href !== undefined) {
    const { classes: _c, className: _cl, disabled, href, onClick, ...rest } = props;
    return disabled ? (
      <a {...rest} role="link" aria-disabled="true" tabIndex={-1} className={root} />
    ) : (
      <a {...rest} href={href} onClick={onClick} className={root} />
    );
  }

  const { classes: _c, className: _cl, href: _h, disabled = false, type = "button", ...rest } = props;
  return <button {...rest} type={type} disabled={disabled} className={root} />;
}
