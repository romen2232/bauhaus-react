"use client";
import { ModalBase, type ModalBaseProps } from "../../_base/Modal/ModalBase.js";
import { MODAL_CLASSES } from "../../../lib/overlays.js";
import { cn } from "../../../lib/cn.js";

export type ModalPlayfulProps = Omit<ModalBaseProps, "classes">;

const c = MODAL_CLASSES.playful;
const classes = {
  overlay: cn(c.scrim, c.motion),
  modal: cn(c.panel, c.motion),
  header: c.header,
  title: c.title,
  body: c.body,
  footer: c.footer,
};

/** Playful modal dialog. */
export function ModalPlayful(props: ModalPlayfulProps) {
  return <ModalBase {...props} classes={classes} />;
}
