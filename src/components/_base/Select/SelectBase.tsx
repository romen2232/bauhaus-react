"use client";
import type { Ref } from "react";
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components";
import { cn } from "../../../lib/cn.js";
import type { SelectClassSet } from "../../../lib/fields.js";
import {
  FieldDescription,
  FieldLabel,
  FieldMessage,
  type FieldCommonProps,
} from "../Field/FieldParts.js";

export type SelectBaseClasses = SelectClassSet;

export type SelectBaseItem = { id: string; label: string; isDisabled?: boolean };

export type SelectBaseProps = FieldCommonProps & {
  items: SelectBaseItem[];
  /** Controlled key. A key that matches no item shows the placeholder. */
  selectedKey?: string | null;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string | null) => void;
  /** Shown while nothing is selected. Defaults to "Select an option". */
  placeholder?: string;
  /** Posts the chosen key in native `FormData` (through React Aria's hidden select). */
  name?: string;
  isRequired?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  validate?: (key: string | null) => string | string[] | true | null | undefined;
  /** `"aria"` (default) validates live; `"native"` defers to the browser on submit. */
  validationBehavior?: "aria" | "native";
  className?: string;
  /** The root element. */
  ref?: Ref<HTMLDivElement>;
  classes: SelectBaseClasses;
};

/** Internal: select on React Aria's `Select` (label, description and error are linked to the trigger). */
export function SelectBase({
  label,
  hideLabel,
  description,
  errorMessage,
  items,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  placeholder = "Select an option",
  validate,
  validationBehavior = "aria",
  className,
  ref,
  classes,
  ...rest
}: SelectBaseProps) {
  return (
    <Select
      {...rest}
      ref={ref}
      selectedKey={selectedKey}
      defaultSelectedKey={defaultSelectedKey}
      onSelectionChange={(key) => onSelectionChange?.(key === null ? null : String(key))}
      placeholder={placeholder}
      validate={validate ? (key) => validate(key === null ? null : String(key)) : undefined}
      validationBehavior={validationBehavior}
      disabledKeys={items.filter((item) => item.isDisabled).map((item) => item.id)}
      className={cn(classes.root, className)}
    >
      <FieldLabel classes={classes} hideLabel={hideLabel} isRequired={rest.isRequired}>
        {label}
      </FieldLabel>
      <div className={classes.control}>
        <Button className={classes.trigger}>
          <SelectValue className={classes.value} />
          <span aria-hidden="true" className={classes.chevron}>
            ▾
          </span>
        </Button>
      </div>
      <FieldDescription classes={classes}>{description}</FieldDescription>
      <FieldMessage classes={classes} errorMessage={errorMessage} />
      <Popover className={classes.popover}>
        <ListBox className={classes.listbox} items={items}>
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.label}
              isDisabled={item.isDisabled}
              className={classes.option}
            >
              {({ isSelected }) => (
                <>
                  <span>{item.label}</span>
                  {isSelected ? (
                    <span aria-hidden="true" className={classes.check}>
                      ✓
                    </span>
                  ) : null}
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}
