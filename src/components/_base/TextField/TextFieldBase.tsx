"use client";
import type { ReactNode, Ref } from "react";
import { Input, TextField } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { FieldClassSet } from "../../../lib/fields.js";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldCommonProps,
} from "../Field/FieldParts.js";

export type TextFieldBaseClasses = FieldClassSet & { control: string; input: string };

export type TextFieldBaseProps = FieldCommonProps & {
  type?: "text" | "email" | "password" | "search" | "url" | "tel";
  /** Set at mount; toggling it later is not linked via aria-describedby (React Aria slot registration). */
  description?: ReactNode;
  /** Participates in native `FormData`. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  validate?: (value: string) => string | string[] | true | null | undefined;
  /** `"aria"` (default) validates live; `"native"` defers to the browser on submit. */
  validationBehavior?: "aria" | "native";
  className?: string;
  /** The root element. */
  ref?: Ref<HTMLDivElement>;
  classes: TextFieldBaseClasses;
};

/** Internal: single-line text input on React Aria (label, description and error are linked). */
export function TextFieldBase({
  label,
  hideLabel,
  description,
  errorMessage,
  type = "text",
  placeholder,
  validationBehavior = "aria",
  className,
  ref,
  classes,
  ...rest
}: TextFieldBaseProps) {
  return (
    <TextField
      {...rest}
      ref={ref}
      type={type}
      validationBehavior={validationBehavior}
      className={cn(classes.root, className)}
    >
      <FieldLabel classes={classes} hideLabel={hideLabel} isRequired={rest.isRequired}>
        {label}
      </FieldLabel>
      <div className={classes.control}>
        <Input className={classes.input} placeholder={placeholder} />
      </div>
      <FieldDescription classes={classes}>{description}</FieldDescription>
      <FieldMessage classes={classes} errorMessage={errorMessage} />
    </TextField>
  );
}
