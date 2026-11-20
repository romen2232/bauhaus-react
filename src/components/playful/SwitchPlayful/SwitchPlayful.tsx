"use client";
import { SwitchBase, type SwitchBaseProps } from "../../_base/Switch/SwitchBase.js";
import { SWITCH_CLASSES, PLAYFUL_CHECKED } from "../../../lib/fields.js";
import { cn } from "../../../lib/cn.js";
import type { FillColor } from "../../../lib/palette.js";

export type SwitchPlayfulProps = Omit<SwitchBaseProps, "classes"> & {
  /** On fill. Defaults to `ink`. */
  color?: FillColor;
};

/** Playful switch. */
export function SwitchPlayful({ color = "ink", ...props }: SwitchPlayfulProps) {
  const classes = SWITCH_CLASSES.playful;
  return <SwitchBase {...props} classes={{ ...classes, track: cn(classes.track, PLAYFUL_CHECKED[color]) }} />;
}
