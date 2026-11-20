"use client";
import type { ReactNode, Ref } from "react";
import { Radio, RadioGroup } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { RadioClassSet } from "../../../lib/fields.js";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldCommonProps,
} from "../Field/FieldParts.js";

export type RadioGroupBaseClasses = RadioClassSet;

export type RadioOption = { value: string; label: ReactNode; isDisabled?: boolean };

export type RadioGroupBaseProps = FieldCommonProps & {
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal";
  /** Posts the chosen value in native `FormData`. */
  name?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  validate?: (value: string | null) => string | string[] | true | null | undefined;
  /** `"aria"` (default) validates live; `"native"` defers to the browser on submit. */
  validationBehavior?: "aria" | "native";
  className?: string;
  /** The root element (the radio group). */
  ref?: Ref<HTMLDivElement>;
  classes: RadioGroupBaseClasses;
};

/** Internal: radio group on React Aria's `RadioGroup` (label, description and error are linked). */
export function RadioGroupBase({
  label,
  hideLabel,
  description,
  errorMessage,
  options,
  orientation = "vertical",
  validationBehavior = "aria",
  className,
  ref,
  classes,
  ...rest
}: RadioGroupBaseProps) {
  return (
    <RadioGroup
      {...rest}
      ref={ref}
      orientation={orientation}
      validationBehavior={validationBehavior}
      className={cn(classes.root, className)}
    >
      <FieldLabel classes={classes} hideLabel={hideLabel} isRequired={rest.isRequired}>
        {label}
      </FieldLabel>
      <div className={classes.options}>
        {options.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            isDisabled={option.isDisabled}
            className={classes.radio}
          >
            {({ isSelected }) => (
              <>
                <span aria-hidden="true" data-checked={isSelected || undefined} className={classes.circle}>
                  <span data-checked={isSelected || undefined} className={classes.dot} />
                </span>
                <span className={classes.optionLabel}>{option.label}</span>
              </>
            )}
          </Radio>
        ))}
      </div>
      <FieldDescription classes={classes}>{description}</FieldDescription>
      <FieldMessage classes={classes} errorMessage={errorMessage} />
    </RadioGroup>
  );
}
