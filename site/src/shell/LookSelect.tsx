import { SelectSwiss } from "bauhaus-react";
import { LOOKS, useLook, type Look } from "../look/LookContext";

const ITEMS = LOOKS.map((id) => ({ id, label: id[0]!.toUpperCase() + id.slice(1) }));

/** Header select that switches the whole site between Mix, Playful, Swiss and Soft. */
export function LookSelect() {
  const { look, setLook } = useLook();
  return (
    <SelectSwiss
      label="Look"
      hideLabel
      items={ITEMS}
      selectedKey={look}
      onSelectionChange={(key) => {
        if (key) setLook(key as Look);
      }}
      className="w-36"
    />
  );
}
