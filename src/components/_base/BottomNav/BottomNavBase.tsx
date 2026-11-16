import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../lib/cn.js";

export type BottomNavItem = { href: string; label: string; icon: ReactNode; current?: boolean };

export type BottomNavBaseClasses = {
  root: string;
  list: string;
  item: string;
  link: string;
  icon: string;
  label: string;
};

export type BottomNavBaseProps = Omit<ComponentProps<"nav">, "children"> & {
  /** Accessible name of the navigation landmark. */
  label: string;
  items: BottomNavItem[];
  /** Show text labels; otherwise they stay available to screen readers only. */
  showLabels?: boolean;
  /** Style the current link with an `aria-[current=page]:` variant in `link`. */
  classes: BottomNavBaseClasses;
};

/** Internal: icon navigation bar; each link is named by its label and the current one has `aria-current="page"`. */
export function BottomNavBase({ label, items, showLabels = false, classes, className, ...props }: BottomNavBaseProps) {
  return (
    <nav aria-label={label} className={cn(classes.root, className)} {...props}>
      <ul className={classes.list}>
        {items.map((item) => (
          <li key={item.href} className={classes.item}>
            <a href={item.href} aria-current={item.current ? "page" : undefined} className={classes.link}>
              <span aria-hidden="true" className={classes.icon}>
                {item.icon}
              </span>
              <span className={showLabels ? classes.label : "sr-only"}>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
