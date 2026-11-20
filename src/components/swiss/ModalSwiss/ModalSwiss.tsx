"use client";
import { ModalBase, type ModalBaseProps } from "../../_base/Modal/ModalBase.js";
import { MODAL_CLASSES } from "../../../lib/overlays.js";
import { cn } from "../../../lib/cn.js";

export type ModalSwissProps = Omit<ModalBaseProps, "classes">;

const c = MODAL_CLASSES.swiss;
const classes = {
  overlay: cn(c.scrim, c.motion),
  modal: cn(c.panel, c.motion),
  header: c.header,
  title: c.title,
  body: c.body,
  footer: c.footer,
};

/** Swiss modal dialog. */
export function ModalSwiss(props: ModalSwissProps) {
  return <ModalBase {...props} classes={classes} />;
}
