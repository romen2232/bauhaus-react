"use client";
import { TextFieldBase, type TextFieldBaseProps } from "../../_base/TextField/TextFieldBase.js";
import { FIELD_CLASSES } from "../../../lib/fields.js";

export type TextFieldPlayfulProps = Omit<TextFieldBaseProps, "classes">;

/** Playful text field. */
export function TextFieldPlayful(props: TextFieldPlayfulProps) {
  return <TextFieldBase {...props} classes={FIELD_CLASSES.playful} />;
}
