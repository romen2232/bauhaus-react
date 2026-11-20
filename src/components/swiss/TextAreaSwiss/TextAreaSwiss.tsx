"use client";
import { TextAreaBase, type TextAreaBaseProps } from "../../_base/TextArea/TextAreaBase.js";
import { FIELD_CLASSES } from "../../../lib/fields.js";

export type TextAreaSwissProps = Omit<TextAreaBaseProps, "classes">;

/** Swiss multi-line text field. */
export function TextAreaSwiss(props: TextAreaSwissProps) {
  return <TextAreaBase {...props} classes={FIELD_CLASSES.swiss} />;
}
