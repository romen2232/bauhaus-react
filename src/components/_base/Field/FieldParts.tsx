"use client";
import type { ReactNode } from "react";
import { FieldError, Label, Text, type ValidationResult } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { FieldClassSet } from "../../../lib/fields.js";

export type FieldCommonProps = {
  /** Visible label. Every field has one. */
  label: ReactNode;
  /** Visually hides the label; it stays the accessible name. */
  hideLabel?: boolean;
  description?: ReactNode;
  errorMessage?: ReactNode | ((v: ValidationResult) => ReactNode);
};

/** Internal: label with an optional "(required)" marker. Render inside a React Aria field. */
export function FieldLabel({
  classes,
  hideLabel,
  isRequired,
  elementType,
  children,
}: {
  classes: Pick<FieldClassSet, "label" | "required">;
  hideLabel?: boolean;
  isRequired?: boolean;
  /** Use `"span"` when the label sits inside another label (toggle controls). */
  elementType?: "label" | "span";
  children: ReactNode;
}) {
  return (
    <Label elementType={elementType} className={cn(classes.label, hideLabel && "sr-only")}>
      {children}
      {isRequired ? <span className={classes.required}> (required)</span> : null}
    </Label>
  );
}

/** Internal: help text linked through `aria-describedby`; renders nothing when empty. */
export function FieldDescription({
  classes,
  children,
}: {
  classes: Pick<FieldClassSet, "description">;
  children?: ReactNode;
}) {
  if (children === undefined || children === null || children === false || children === "") {
    return null;
  }
  return (
    <Text slot="description" className={classes.description}>
      {children}
    </Text>
  );
}

/** Internal: error message shown only while the field is invalid, with an optional marker. */
export function FieldMessage({
  classes,
  errorMessage,
}: {
  classes: Pick<FieldClassSet, "error" | "errorMarker">;
  errorMessage?: FieldCommonProps["errorMessage"];
}) {
  return (
    <FieldError className={classes.error}>
      {(v) => (
        <>
          {classes.errorMarker === "" ? null : <span aria-hidden className={classes.errorMarker} />}
          {typeof errorMessage === "function"
            ? errorMessage(v)
            : (errorMessage ?? v.validationErrors.join(" "))}
        </>
      )}
    </FieldError>
  );
}
