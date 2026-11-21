import { CheckboxSwiss, SelectSwiss, TextFieldSwiss } from "bauhaus-react";
import type { Control, PlaygroundValues } from "./registry/types";

type Props = {
  controls: Control[];
  values: PlaygroundValues;
  onChange: (prop: string, value: string | boolean) => void;
};

/** Controls for the page's most useful props; every visible look row re-renders live. */
export function Playground({ controls, values, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-end gap-6 border border-bh-ink p-4">
      {controls.map((c) => {
        if (c.kind === "boolean") {
          return (
            <CheckboxSwiss key={c.prop} label={c.prop} isSelected={Boolean(values[c.prop])} onChange={(v) => onChange(c.prop, v)} />
          );
        }
        if (c.kind === "select") {
          return (
            <SelectSwiss
              key={c.prop}
              label={c.prop}
              items={(c.options ?? []).map((id) => ({ id, label: id }))}
              selectedKey={String(values[c.prop])}
              onSelectionChange={(k) => k && onChange(c.prop, k)}
              className="w-44"
            />
          );
        }
        return <TextFieldSwiss key={c.prop} label={c.prop} value={String(values[c.prop] ?? "")} onChange={(v) => onChange(c.prop, v)} />;
      })}
    </div>
  );
}
