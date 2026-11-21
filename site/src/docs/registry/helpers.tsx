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

const svg = (inner: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">${inner}</svg>`)}`;

/** A small Bauhaus composition used as demo imagery, so no image files are needed. */
export const DEMO_IMAGE = svg(
  '<rect width="120" height="120" fill="#f4efe6"/><circle cx="46" cy="46" r="34" fill="#1f5fd8"/><rect x="62" y="62" width="46" height="46" fill="#ea4535"/><polygon points="14,108 44,64 74,108" fill="#f5b62a"/>',
);
