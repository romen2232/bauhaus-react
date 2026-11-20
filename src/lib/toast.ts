"use client";
import { UNSTABLE_ToastQueue } from "react-aria-components";
import type { FillColor, SoftTone } from "./palette.js";

export type ToastOptions = {
  title: string;
  description?: string;
  /** Pressing it runs `onAction` and then closes the toast. A toast with an action never auto-dismisses. */
  action?: { label: string; onAction: () => void };
  /** Milliseconds before auto-dismiss. Default 5000. Ignored when `action` is set. */
  timeout?: number;
  /** Playful fill colour. */
  color?: FillColor;
  /** Soft tone dot. */
  tone?: SoftTone;
};

/** What the queue stores per toast (the timeout lives on the queue entry). Internal. */
export type ToastContentValue = Omit<ToastOptions, "timeout">;

/** Opaque handle: call it to show a toast, `close(id)` to remove one. Pass it to a `ToastRegion*` as `queue`. */
export type ToastQueueHandle = ((options: ToastOptions) => string) & { close(id: string): void };

const DEFAULT_TIMEOUT = 5000;
const MAX_VISIBLE_TOASTS = 3;

const queues = new WeakMap<ToastQueueHandle, UNSTABLE_ToastQueue<ToastContentValue>>();

/** Creates an independent toast queue, for a region that should show only its own toasts. */
export function createToastQueue(): ToastQueueHandle {
  const queue = new UNSTABLE_ToastQueue<ToastContentValue>({ maxVisibleToasts: MAX_VISIBLE_TOASTS });
  const handle = ((options: ToastOptions): string => {
    const { title, description, action, color, tone, timeout } = options;
    // WCAG 2.2.1: a toast with an action must not disappear on its own.
    const effectiveTimeout = action ? undefined : (timeout ?? DEFAULT_TIMEOUT);
    return queue.add({ title, description, action, color, tone }, { timeout: effectiveTimeout });
  }) as ToastQueueHandle;
  handle.close = (id: string) => queue.close(id);
  queues.set(handle, queue);
  return handle;
}

/** The default shared queue, rendered by a `ToastRegion*` with no `queue` prop. */
export const toast: ToastQueueHandle = createToastQueue();

/** Internal: the React Aria queue behind a handle. Not exported from the package. */
export function getRacQueue(handle: ToastQueueHandle): UNSTABLE_ToastQueue<ToastContentValue> {
  const queue = queues.get(handle);
  if (!queue) throw new Error("Unknown toast queue: create it with createToastQueue().");
  return queue;
}
