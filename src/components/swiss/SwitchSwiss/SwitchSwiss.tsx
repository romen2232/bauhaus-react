"use client";
import { SwitchBase, type SwitchBaseProps } from "../../_base/Switch/SwitchBase.js";
import { SWITCH_CLASSES } from "../../../lib/fields.js";

export type SwitchSwissProps = Omit<SwitchBaseProps, "classes">;

/** Swiss switch. */
export function SwitchSwiss(props: SwitchSwissProps) {
  return <SwitchBase {...props} classes={SWITCH_CLASSES.swiss} />;
}
