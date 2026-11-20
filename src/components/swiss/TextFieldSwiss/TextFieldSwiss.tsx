"use client";
import { TextFieldBase, type TextFieldBaseProps } from "../../_base/TextField/TextFieldBase.js";
import { FIELD_CLASSES } from "../../../lib/fields.js";

export type TextFieldSwissProps = Omit<TextFieldBaseProps, "classes">;

/** Swiss text field. */
export function TextFieldSwiss(props: TextFieldSwissProps) {
  return <TextFieldBase {...props} classes={FIELD_CLASSES.swiss} />;
}
