"use client";
import type { ReactNode, Ref } from "react";
import { TextArea, TextField } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { FieldClassSet } from "../../../lib/fields.js";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldCommonProps,
} from "../Field/FieldParts.js";

export type TextAreaBaseClasses = FieldClassSet & { control: string; textarea: string };

export type TextAreaBaseProps = FieldCommonProps & {
  /** Set at mount; toggling it later is not linked via aria-describedby (React Aria slot registration). */
  description?: ReactNode;
  /** Participates in native `FormData`. */
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  /** Visible rows. Defaults to 3. */
  rows?: number;
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
  classes: TextAreaBaseClasses;
};

/** Internal: multi-line text input on React Aria (label, description and error are linked). */
export function TextAreaBase({
  label,
  hideLabel,
  description,
  errorMessage,
  placeholder,
  rows = 3,
  validationBehavior = "aria",
  className,
  ref,
  classes,
  ...rest
}: TextAreaBaseProps) {
  return (
    <TextField
      {...rest}
      ref={ref}
      validationBehavior={validationBehavior}
      className={cn(classes.root, className)}
    >
      <FieldLabel classes={classes} hideLabel={hideLabel} isRequired={rest.isRequired}>
        {label}
      </FieldLabel>
      <div className={classes.control}>
        {/* cn() resolves conflicting utilities (e.g. h-11 then h-auto) so the textarea can grow. */}
        <TextArea className={cn(classes.textarea)} placeholder={placeholder} rows={rows} />
      </div>
      <FieldDescription classes={classes}>{description}</FieldDescription>
      <FieldMessage classes={classes} errorMessage={errorMessage} />
    </TextField>
  );
}
