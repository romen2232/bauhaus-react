"use client";
import { RadioGroupBase, type RadioGroupBaseProps } from "../../_base/RadioGroup/RadioGroupBase.js";
import { RADIO_CLASSES } from "../../../lib/fields.js";

export type RadioGroupSwissProps = Omit<RadioGroupBaseProps, "classes">;

/** Swiss radio group. */
export function RadioGroupSwiss(props: RadioGroupSwissProps) {
  return <RadioGroupBase {...props} classes={RADIO_CLASSES.swiss} />;
}
