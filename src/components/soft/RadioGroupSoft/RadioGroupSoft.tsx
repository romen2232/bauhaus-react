"use client";
import { RadioGroupBase, type RadioGroupBaseProps } from "../../_base/RadioGroup/RadioGroupBase.js";
import { RADIO_CLASSES, SOFT_CHECKED } from "../../../lib/fields.js";
import { cn } from "../../../lib/cn.js";
import type { SoftTone } from "../../../lib/palette.js";

export type RadioGroupSoftProps = Omit<RadioGroupBaseProps, "classes"> & {
  /** Fill of the selected circle. Defaults to `neutral`. */
  tone?: SoftTone;
};

/** Soft radio group. */
export function RadioGroupSoft({ tone = "neutral", ...props }: RadioGroupSoftProps) {
  const classes = RADIO_CLASSES.soft;
  return <RadioGroupBase {...props} classes={{ ...classes, circle: cn(classes.circle, SOFT_CHECKED[tone]) }} />;
}
