"use client";
import type { Ref } from "react";
import { SwitchButton, SwitchField } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { SwitchClassSet } from "../../../lib/fields.js";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldCommonProps,
} from "../Field/FieldParts.js";

export type SwitchBaseClasses = SwitchClassSet;

export type SwitchBaseProps = FieldCommonProps & {
  isSelected?: boolean;
  defaultSelected?: boolean;
  onChange?: (isSelected: boolean) => void;
  /** With `value`, participates in native `FormData` while on. */
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
  classes: SwitchBaseClasses;
};

/** Internal: switch on React Aria's `SwitchField` (label, description and error are linked). */
export function SwitchBase({
  label,
  hideLabel,
  description,
  errorMessage,
  validationBehavior = "aria",
  className,
  ref,
  classes,
  ...rest
}: SwitchBaseProps) {
  return (
    <SwitchField
      {...rest}
      ref={ref}
      validationBehavior={validationBehavior}
      className={cn(classes.root, className)}
    >
      <SwitchButton className={classes.button}>
        {({ isSelected }) => (
          <>
            <span aria-hidden="true" data-checked={isSelected || undefined} className={classes.track}>
              <span data-checked={isSelected || undefined} className={classes.thumb} />
            </span>
            <FieldLabel elementType="span" classes={classes} hideLabel={hideLabel} isRequired={rest.isRequired}>
              {label}
            </FieldLabel>
          </>
        )}
      </SwitchButton>
      <FieldDescription classes={classes}>{description}</FieldDescription>
      <FieldMessage classes={classes} errorMessage={errorMessage} />
    </SwitchField>
  );
}
