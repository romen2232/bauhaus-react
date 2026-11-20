"use client";
import { SwitchBase, type SwitchBaseProps } from "../../_base/Switch/SwitchBase.js";
import { SWITCH_CLASSES, SOFT_CHECKED } from "../../../lib/fields.js";
import { cn } from "../../../lib/cn.js";
import type { SoftTone } from "../../../lib/palette.js";

export type SwitchSoftProps = Omit<SwitchBaseProps, "classes"> & {
  /** On fill. Defaults to `neutral`. */
  tone?: SoftTone;
};

/** Soft switch. */
export function SwitchSoft({ tone = "neutral", ...props }: SwitchSoftProps) {
  const classes = SWITCH_CLASSES.soft;
  return <SwitchBase {...props} classes={{ ...classes, track: cn(classes.track, SOFT_CHECKED[tone]) }} />;
}
