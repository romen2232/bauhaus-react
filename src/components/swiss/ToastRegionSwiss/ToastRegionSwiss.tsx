"use client";
import { ToastBase, type ToastBaseClasses, type ToastBaseProps } from "../../_base/Toast/ToastBase.js";
import { TOAST_CLASSES } from "../../../lib/overlays.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { cn } from "../../../lib/cn.js";

export type ToastRegionSwissProps = Omit<ToastBaseProps, "classes">;

const c = TOAST_CLASSES.swiss;
const classes: ToastBaseClasses = {
  region: "",
  list: "",
  toast: () => cn(c.toast, FOCUS_RING, c.motion),
  content: c.content,
  title: c.title,
  description: c.description,
  action: c.action,
  close: c.close,
};

/** Swiss toast region: paper-white with a 2px ink top rule; the action is underlined text. Enters with a clip-path wipe; there is no exit animation. */
export function ToastRegionSwiss(props: ToastRegionSwissProps) {
  return <ToastBase {...props} classes={classes} />;
}
