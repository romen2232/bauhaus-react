"use client";
import { CheckboxBase, type CheckboxBaseProps } from "../../_base/Checkbox/CheckboxBase.js";
import { CHECKBOX_CLASSES, SOFT_CHECKED } from "../../../lib/fields.js";
import { cn } from "../../../lib/cn.js";
import type { SoftTone } from "../../../lib/palette.js";

export type CheckboxSoftProps = Omit<CheckboxBaseProps, "classes"> & {
  /** Checked fill. Defaults to `neutral`. */
  tone?: SoftTone;
};

/** Soft checkbox. */
export function CheckboxSoft({ tone = "neutral", ...props }: CheckboxSoftProps) {
  const classes = CHECKBOX_CLASSES.soft;
  return <CheckboxBase {...props} classes={{ ...classes, box: cn(classes.box, SOFT_CHECKED[tone]) }} />;
}
