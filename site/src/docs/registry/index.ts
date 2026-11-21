import { ACTIONS } from "./actions";
import { DATA } from "./data";
import { DECORATION } from "./decoration";
import { FORMS } from "./forms";
import { LAYOUT } from "./layout";
import { MEDIA } from "./media";
import { NAVIGATION } from "./navigation";
import { OVERLAYS } from "./overlays";
import type { DocEntry } from "./types";

export const REGISTRY: DocEntry[] = [...ACTIONS, ...FORMS, ...OVERLAYS, ...NAVIGATION, ...DATA, ...MEDIA, ...LAYOUT, ...DECORATION];

export function findEntry(slug: string): DocEntry | undefined {
  return REGISTRY.find((entry) => entry.slug === slug);
}
