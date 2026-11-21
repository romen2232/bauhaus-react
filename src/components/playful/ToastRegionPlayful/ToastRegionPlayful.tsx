"use client";
import { ToastBase, type ToastBaseClasses, type ToastBaseProps } from "../../_base/Toast/ToastBase.js";
import { TOAST_CLASSES } from "../../../lib/overlays.js";
import { FILL_CLASSES } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { cn } from "../../../lib/cn.js";

export type ToastRegionPlayfulProps = Omit<ToastBaseProps, "classes">;

const c = TOAST_CLASSES.playful;
const classes: ToastBaseClasses = {
  region: "",
  list: "",
  toast: (content) => cn(FILL_CLASSES[content.color ?? "blue"], c.toast, FOCUS_RING, c.motion),
  content: c.content,
  title: c.title,
  description: c.description,
  action: c.action,
  close: c.close,
};

/** Playful toast region: a solid colour fill (`color`, default blue) with a hard shadow. Enters with a short drop; there is no exit animation. */
export function ToastRegionPlayful(props: ToastRegionPlayfulProps) {
  return <ToastBase {...props} classes={classes} />;
}
