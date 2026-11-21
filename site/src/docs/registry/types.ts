import type { ReactNode } from "react";
import type { SingleLook } from "../../look/LookContext";

export const GROUPS = [
  "Actions",
  "Forms",
  "Overlays",
  "Navigation",
  "Data & charts",
  "Media & cards",
  "Layout & type",
  "Decoration",
] as const;
export type Group = (typeof GROUPS)[number];

export type PlaygroundValues = Record<string, unknown>;
export type Control = {
  prop: string;
  kind: "text" | "boolean" | "select";
  options?: string[];
  initial: string | boolean;
};
export type Demo = (values: PlaygroundValues) => ReactNode;
export type LookDemo = { exportName: string; demo: Demo; snippet: string };
export type PrincipleId = `p${number}`;

/** One docs page. Exactly one of `looks` (a component with Playful/Swiss/Soft skins) or `agnostic`. */
export type DocEntry = {
  slug: string;
  title: string;
  group: Group;
  purpose: string;
  principles: PrincipleId[];
  looks?: Partial<Record<SingleLook, LookDemo>>;
  agnostic?: { exportNames: string[]; demo: Demo; snippet: string };
  controls: Control[];
  dos: string[];
  donts: string[];
  a11y: string[];
};
