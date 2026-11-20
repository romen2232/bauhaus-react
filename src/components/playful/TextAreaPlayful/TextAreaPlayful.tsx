"use client";
import { TextAreaBase, type TextAreaBaseProps } from "../../_base/TextArea/TextAreaBase.js";
import { FIELD_CLASSES } from "../../../lib/fields.js";

export type TextAreaPlayfulProps = Omit<TextAreaBaseProps, "classes">;

/** Playful multi-line text field. */
export function TextAreaPlayful(props: TextAreaPlayfulProps) {
  return <TextAreaBase {...props} classes={FIELD_CLASSES.playful} />;
}
