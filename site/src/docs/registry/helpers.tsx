import type { ComponentType, ReactNode } from "react";
import type { SingleLook } from "../../look/LookContext";
import type { LookDemo, PlaygroundValues } from "./types";

// Skins of one component differ in props (colour vs tone), so the registry treats them loosely.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyComponent = ComponentType<any>;

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);

/**
 * Builds the three look demos of one component. `base` is the export name without the look suffix
 * (e.g. "Button" gives ButtonPlayful, ButtonSwiss, ButtonSoft).
 */
export function skins(
  base: string,
  components: Record<SingleLook, AnyComponent>,
  render: (C: AnyComponent, values: PlaygroundValues, look: SingleLook) => ReactNode,
  snippet: (exportName: string) => string,
): Record<SingleLook, LookDemo> {
  const build = (look: SingleLook): LookDemo => {
    const exportName = `${base}${cap(look)}`;
    return { exportName, demo: (values) => render(components[look], values, look), snippet: snippet(exportName) };
  };
  return { playful: build("playful"), swiss: build("swiss"), soft: build("soft") };
}

export const text = (values: PlaygroundValues, key: string): string => String(values[key] ?? "");
export const flag = (values: PlaygroundValues, key: string): boolean => Boolean(values[key]);

export const imports = (...names: string[]): string => `import { ${names.join(", ")} } from "bauhaus-react";`;
