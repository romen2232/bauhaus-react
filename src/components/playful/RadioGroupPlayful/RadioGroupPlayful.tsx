"use client";
import { RadioGroupBase, type RadioGroupBaseProps } from "../../_base/RadioGroup/RadioGroupBase.js";
import { RADIO_CLASSES, PLAYFUL_CHECKED } from "../../../lib/fields.js";
import { cn } from "../../../lib/cn.js";
import type { FillColor } from "../../../lib/palette.js";

export type RadioGroupPlayfulProps = Omit<RadioGroupBaseProps, "classes"> & {
  /** Fill of the selected circle. Defaults to `ink`. */
  color?: FillColor;
};

/** Playful radio group. */
export function RadioGroupPlayful({ color = "ink", ...props }: RadioGroupPlayfulProps) {
  const classes = RADIO_CLASSES.playful;
  return <RadioGroupBase {...props} classes={{ ...classes, circle: cn(classes.circle, PLAYFUL_CHECKED[color]) }} />;
}
