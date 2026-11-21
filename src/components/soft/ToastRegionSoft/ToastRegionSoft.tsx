"use client";
import { ToastBase, type ToastBaseClasses, type ToastBaseProps } from "../../_base/Toast/ToastBase.js";
import { TOAST_CLASSES } from "../../../lib/overlays.js";
import type { SoftTone } from "../../../lib/palette.js";
import { FOCUS_RING } from "../../../lib/styles.js";
import { cn } from "../../../lib/cn.js";

export type ToastRegionSoftProps = Omit<ToastBaseProps, "classes">;

/** Tone dot colours. Decoration only: the dot is aria-hidden and the title carries the meaning. */
const TONE_DOT: Record<SoftTone, string> = {
  red: "bg-bh-red",
  yellow: "bg-bh-yellow",
  blue: "bg-bh-blue",
  neutral: "bg-bh-paper",
};

const c = TOAST_CLASSES.soft;
const classes: ToastBaseClasses = {
  region: "",
  list: "",
  toast: () => cn(c.toast, FOCUS_RING, c.motion),
  marker: (content) => cn("size-2 shrink-0 rounded-full ms-5", TONE_DOT[content.tone ?? "neutral"]),
  content: c.content,
  title: c.title,
  description: c.description,
  action: c.action,
  close: c.close,
};

/** Soft toast region: a charcoal pill with paper text and a tone dot. Enters with a short slide and fade; there is no exit animation. */
export function ToastRegionSoft(props: ToastRegionSoftProps) {
  return <ToastBase {...props} classes={classes} />;
}
