"use client";
import type { ReactNode, Ref } from "react";
import { Button, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components";
import { cn } from "../../../lib/cn.js";

export type MenuLink = { href: string; label: string; current?: boolean };

export type MenuOverlayBaseClasses = {
  trigger: string;
  overlay: string;
  panel: string;
  close: string;
  list: string;
  item: string;
  link: string;
  secondary: string;
};

export type MenuOverlayBaseProps = {
  /** Visible label and accessible name of the button that opens the menu. */
  triggerLabel: string;
  /** Accessible name of the menu dialog (rendered as a visually hidden heading). */
  title: string;
  links: MenuLink[];
  /** Extra content under the links, e.g. a social list. */
  secondary?: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Applied to the trigger: the overlay itself renders in a portal. */
  className?: string;
  /** The trigger button. */
  ref?: Ref<HTMLButtonElement>;
  classes: MenuOverlayBaseClasses;
};

/**
 * Internal: fullscreen menu on React Aria's modal dialog. Focus is trapped while open,
 * `Esc`, the close button or any link closes it, and focus returns to the trigger.
 */
export function MenuOverlayBase({
  triggerLabel,
  title,
  links,
  secondary,
  isOpen,
  defaultOpen,
  onOpenChange,
  className,
  ref,
  classes,
}: MenuOverlayBaseProps) {
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Button ref={ref} className={cn(classes.trigger, className)}>{triggerLabel}</Button>
      <ModalOverlay className={classes.overlay}>
        <Modal className={classes.panel}>
          <Dialog className="outline-none">
            {({ close }) => (
              <>
                <Heading slot="title" className="sr-only">
                  {title}
                </Heading>
                <Button className={classes.close} onPress={close}>
                  Close menu
                </Button>
                <ul className={classes.list}>
                  {links.map((link) => (
                    <li key={link.href} className={classes.item}>
                      <a
                        href={link.href}
                        aria-current={link.current ? "page" : undefined}
                        className={classes.link}
                        onClick={close}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                {secondary !== undefined && <div className={classes.secondary}>{secondary}</div>}
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
