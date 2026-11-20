"use client";
import { TextAreaBase, type TextAreaBaseProps } from "../../_base/TextArea/TextAreaBase.js";
import { FIELD_CLASSES } from "../../../lib/fields.js";

export type TextAreaSoftProps = Omit<TextAreaBaseProps, "classes">;

/** Soft multi-line text field. */
export function TextAreaSoft(props: TextAreaSoftProps) {
  return <TextAreaBase {...props} classes={FIELD_CLASSES.soft} />;
}
