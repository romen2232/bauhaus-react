"use client";
import { SelectBase, type SelectBaseProps } from "../../_base/Select/SelectBase.js";
import { SELECT_CLASSES } from "../../../lib/fields.js";

export type SelectPlayfulProps = Omit<SelectBaseProps, "classes">;

/** Playful select. */
export function SelectPlayful(props: SelectPlayfulProps) {
  return <SelectBase {...props} classes={SELECT_CLASSES.playful} />;
}
