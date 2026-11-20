"use client";
import { CheckboxBase, type CheckboxBaseProps } from "../../_base/Checkbox/CheckboxBase.js";
import { CHECKBOX_CLASSES, PLAYFUL_CHECKED } from "../../../lib/fields.js";
import { cn } from "../../../lib/cn.js";
import type { FillColor } from "../../../lib/palette.js";

export type CheckboxPlayfulProps = Omit<CheckboxBaseProps, "classes"> & {
  /** Checked fill. Defaults to `ink`. */
  color?: FillColor;
};

/** Playful checkbox. */
export function CheckboxPlayful({ color = "ink", ...props }: CheckboxPlayfulProps) {
  const classes = CHECKBOX_CLASSES.playful;
  return <CheckboxBase {...props} classes={{ ...classes, box: cn(classes.box, PLAYFUL_CHECKED[color]) }} />;
}
