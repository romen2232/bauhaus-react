"use client";
import { SelectBase, type SelectBaseProps } from "../../_base/Select/SelectBase.js";
import { SELECT_CLASSES } from "../../../lib/fields.js";

export type SelectSwissProps = Omit<SelectBaseProps, "classes">;

/** Swiss select. */
export function SelectSwiss(props: SelectSwissProps) {
  return <SelectBase {...props} classes={SELECT_CLASSES.swiss} />;
}
