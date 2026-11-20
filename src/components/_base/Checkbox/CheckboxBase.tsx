"use client";
import type { Ref } from "react";
import { CheckboxButton, CheckboxField } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { CheckboxClassSet } from "../../../lib/fields.js";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldCommonProps,
} from "../Field/FieldParts.js";

export type CheckboxBaseClasses = CheckboxClassSet;

export type CheckboxBaseProps = FieldCommonProps & {
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  isIndeterminate?: boolean;
  /** With `value`, participates in native `FormData` while checked. */
  name?: string;
  value?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  validate?: (isSelected: boolean) => string | string[] | true | null | undefined;
  /** `"aria"` (default) validates live; `"native"` defers to the browser on submit. */
  validationBehavior?: "aria" | "native";
  className?: string;
  /** The root element. */
  ref?: Ref<HTMLDivElement>;
  classes: CheckboxBaseClasses;
};

/** Internal: checkbox on React Aria's `CheckboxField` (label, description and error are linked). */
export function CheckboxBase({
  label,
  hideLabel,
  description,
  errorMessage,
  validationBehavior = "aria",
  className,
  ref,
  classes,
  ...rest
}: CheckboxBaseProps) {
  return (
    <CheckboxField
      {...rest}
      ref={ref}
      validationBehavior={validationBehavior}
      className={cn(classes.root, className)}
    >
      <CheckboxButton className={classes.button}>
        {({ isSelected, isIndeterminate }) => {
          const on = isSelected || isIndeterminate;
          return (
            <>
              <span aria-hidden="true" data-checked={on || undefined} className={classes.box}>
                <span className={classes.indicator}>
                  {isIndeterminate ? "—" : isSelected ? "✓" : null}
                </span>
              </span>
              <FieldLabel elementType="span" classes={classes} hideLabel={hideLabel} isRequired={rest.isRequired}>
                {label}
              </FieldLabel>
            </>
          );
        }}
      </CheckboxButton>
      <FieldDescription classes={classes}>{description}</FieldDescription>
      <FieldMessage classes={classes} errorMessage={errorMessage} />
    </CheckboxField>
  );
}
