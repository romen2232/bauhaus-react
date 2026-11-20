"use client";
import { SelectBase, type SelectBaseProps } from "../../_base/Select/SelectBase.js";
import { SELECT_CLASSES } from "../../../lib/fields.js";

export type SelectSoftProps = Omit<SelectBaseProps, "classes">;

/** Soft select. */
export function SelectSoft(props: SelectSoftProps) {
  return <SelectBase {...props} classes={SELECT_CLASSES.soft} />;
}
