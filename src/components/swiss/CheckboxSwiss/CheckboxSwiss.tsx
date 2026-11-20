"use client";
import { CheckboxBase, type CheckboxBaseProps } from "../../_base/Checkbox/CheckboxBase.js";
import { CHECKBOX_CLASSES } from "../../../lib/fields.js";

export type CheckboxSwissProps = Omit<CheckboxBaseProps, "classes">;

/** Swiss checkbox. */
export function CheckboxSwiss(props: CheckboxSwissProps) {
  return <CheckboxBase {...props} classes={CHECKBOX_CLASSES.swiss} />;
}
