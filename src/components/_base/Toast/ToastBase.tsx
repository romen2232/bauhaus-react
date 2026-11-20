"use client";
import type { ReactElement, Ref } from "react";
import {
  Button,
  Text,
  UNSTABLE_Toast,
  UNSTABLE_ToastContent,
  UNSTABLE_ToastList,
  UNSTABLE_ToastRegion,
} from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import { getRacQueue, toast, type ToastContentValue, type ToastQueueHandle } from "../../../lib/toast.js";

export type ToastPlacement = "bottom-end" | "bottom" | "top-end" | "top";

export type ToastBaseClasses = {
  region: string;
  list: string;
  toast: (content: ToastContentValue) => string;
  /** When present, renders an `aria-hidden` span before the text. */
  marker?: (content: ToastContentValue) => string;
  content: string;
  title: string;
  description: string;
  action: string;
  close: string;
};

export type ToastBaseProps = {
  /** The queue to render. Default: the shared `toast` queue. */
  queue?: ToastQueueHandle;
  /** Default `"bottom-end"`. */
  placement?: ToastPlacement;
  /** The region's accessible name. Default "Notifications" (React Aria's own default is a live count such as "1 notification."). */
  "aria-label"?: string;
  className?: string;
  /** The region element. */
  ref?: Ref<HTMLDivElement>;
  classes: ToastBaseClasses;
};

const PLACEMENT_CLASSES: Record<ToastPlacement, string> = {
  "bottom-end": "bottom-0 end-0 items-end",
  bottom: "bottom-0 inset-x-0 items-center",
  "top-end": "top-0 end-0 items-end",
  top: "top-0 inset-x-0 items-center",
};

/**
 * Internal: toast region on React Aria's `UNSTABLE_Toast*` parts. It renders nothing while the
 * queue is empty, shows at most 3 toasts, and pauses auto-dismiss on hover and focus.
 * A toast's timer starts when the toast mounts, so a toast added before the region exists
 * starts counting once it appears.
 */
export function ToastBase({
  queue = toast,
  placement = "bottom-end",
  "aria-label": ariaLabel = "Notifications",
  className,
  ref,
  classes,
}: ToastBaseProps): ReactElement {
  return (
    <UNSTABLE_ToastRegion
      ref={ref}
      queue={getRacQueue(queue)}
      aria-label={ariaLabel}
      className={cn("fixed z-50 flex flex-col gap-3 p-4 outline-none", PLACEMENT_CLASSES[placement], classes.region, className)}
    >
      <UNSTABLE_ToastList className={cn("flex flex-col gap-3", classes.list)}>
        {({ toast: t }) => {
          // UNSTABLE_ToastList is not generic, so its toast carries `content: unknown`; the queue only ever stores ToastContentValue.
          const content = t.content as ToastContentValue;
          return (
          <UNSTABLE_Toast toast={t} className={classes.toast(content)}>
            {classes.marker && <span aria-hidden="true" className={classes.marker(content)} />}
            <UNSTABLE_ToastContent className={classes.content}>
              <Text slot="title" className={classes.title}>
                {content.title}
              </Text>
              {content.description !== undefined && (
                <Text slot="description" className={classes.description}>
                  {content.description}
                </Text>
              )}
            </UNSTABLE_ToastContent>
            {content.action && (
              <Button
                className={classes.action}
                onPress={() => {
                  content.action?.onAction();
                  queue.close(t.key);
                }}
              >
                {content.action.label}
              </Button>
            )}
            <Button slot="close" className={classes.close}>
              <span aria-hidden="true">×</span>
            </Button>
          </UNSTABLE_Toast>
          );
        }}
      </UNSTABLE_ToastList>
    </UNSTABLE_ToastRegion>
  );
}
