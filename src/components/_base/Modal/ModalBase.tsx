"use client";
import type { ComponentProps, ReactElement, ReactNode, Ref } from "react";
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Pressable,
} from "react-aria-components";
import { cn } from "../../../lib/cn.js";

export type ModalSize = "sm" | "md" | "lg";
export type ModalRenderApi = { close: () => void };
export type ModalSlot = ReactNode | ((api: ModalRenderApi) => ReactNode);

export type ModalBaseClasses = {
  overlay: string;
  modal: string;
  header: string;
  title: string;
  body: string;
  footer: string;
};

export type ModalBaseProps = {
  /** The dialog heading and its accessible name. */
  title: string;
  /** Body content, or a function that receives `close`. */
  children: ModalSlot;
  /** Footer content, or a function that receives `close`. Not rendered when omitted. */
  footer?: ModalSlot;
  /** Any element that accepts press events (a native button or a `Button*` skin). */
  trigger?: ReactElement;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Close on scrim click. Default `true`; never applies to `alertdialog`. */
  isDismissable?: boolean;
  role?: "dialog" | "alertdialog";
  /** Id of the element that describes the dialog (read after its name). */
  "aria-describedby"?: string;
  size?: ModalSize;
  /** Merged last into the dialog panel. */
  className?: string;
  /** The dialog panel. */
  ref?: Ref<HTMLDivElement>;
  classes: ModalBaseClasses;
};

type PressableChild = ComponentProps<typeof Pressable>["children"];

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const resolve = (slot: ModalSlot, api: ModalRenderApi): ReactNode =>
  typeof slot === "function" ? slot(api) : slot;

/**
 * Internal: modal dialog on React Aria. Focus is trapped while open, `Esc` closes it
 * and focus returns to the trigger. The body scrolls while header and footer stay put.
 */
export function ModalBase({
  title,
  children,
  footer,
  trigger,
  isOpen,
  defaultOpen,
  onOpenChange,
  isDismissable = true,
  role = "dialog",
  "aria-describedby": ariaDescribedby,
  size = "md",
  className,
  ref,
  classes,
}: ModalBaseProps) {
  const overlay = (
    <ModalOverlay
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", classes.overlay)}
      isDismissable={role !== "alertdialog" && isDismissable}
      {...(trigger ? {} : { isOpen, defaultOpen, onOpenChange })}
    >
      <Modal
        ref={ref}
        className={cn("flex max-h-full w-full flex-col", SIZE_CLASSES[size], classes.modal, className)}
      >
        <Dialog role={role} aria-describedby={ariaDescribedby} className="flex min-h-0 flex-1 flex-col outline-none">
          {({ close }) => (
            <>
              <div className={cn("shrink-0", classes.header)}>
                <Heading slot="title" className={classes.title}>
                  {title}
                </Heading>
              </div>
              <div className={cn("min-h-0 flex-1 overflow-y-auto", classes.body)}>
                {resolve(children, { close })}
              </div>
              {footer !== undefined && (
                <div className={cn("shrink-0", classes.footer)}>{resolve(footer, { close })}</div>
              )}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );

  if (!trigger) return overlay;
  return (
    <DialogTrigger isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Pressable>{trigger as PressableChild}</Pressable>
      {overlay}
    </DialogTrigger>
  );
}
