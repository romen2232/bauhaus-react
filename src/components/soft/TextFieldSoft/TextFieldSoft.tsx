"use client";
import { TextFieldBase, type TextFieldBaseProps } from "../../_base/TextField/TextFieldBase.js";
import { FIELD_CLASSES } from "../../../lib/fields.js";

export type TextFieldSoftProps = Omit<TextFieldBaseProps, "classes">;

/** Soft text field. */
export function TextFieldSoft(props: TextFieldSoftProps) {
  return <TextFieldBase {...props} classes={FIELD_CLASSES.soft} />;
}
