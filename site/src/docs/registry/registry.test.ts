import * as library from "bauhaus-react";
import { GROUPS } from "./types";
import { REGISTRY, findEntry } from "./index";

const LOOK_SUFFIX = /(Playful|Swiss|Soft)$/;
// Internal bases that are exported but are not documented components.
const IGNORED = new Set<string>([]);

const componentExports = () =>
  Object.entries(library)
    .filter(([name, value]) => typeof value === "function" && /^[A-Z]/.test(name) && !IGNORED.has(name))
    .map(([name]) => name);

describe("registry", () => {
  test("slugs are unique and kebab-case", () => {
    const slugs = REGISTRY.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  test("every entry is in a known group and has exactly one of looks or agnostic", () => {
    for (const entry of REGISTRY) {
      expect(GROUPS).toContain(entry.group);
      expect(Boolean(entry.looks) !== Boolean(entry.agnostic), entry.slug).toBe(true);
    }
  });

  test("findEntry finds by slug", () => {
    const first = REGISTRY[0];
    if (first) expect(findEntry(first.slug)).toBe(first);
    expect(findEntry("does-not-exist")).toBeUndefined();
  });

  // Gated until every group is written (Task 12); run early with REGISTRY_COMPLETE=1.
  test.skipIf(process.env.REGISTRY_COMPLETE !== "1")("every library component is documented", () => {
    const documented = new Set<string>();
    for (const entry of REGISTRY) {
      for (const look of Object.values(entry.looks ?? {})) documented.add(look.exportName);
      for (const name of entry.agnostic?.exportNames ?? []) documented.add(name);
    }
    const missing = componentExports().filter((name) => !documented.has(name));
    expect(missing, `undocumented: ${missing.join(", ")}`).toEqual([]);
    // Looked components are documented through `looks`, never `agnostic`.
    for (const entry of REGISTRY) {
      for (const name of entry.agnostic?.exportNames ?? []) expect(name).not.toMatch(LOOK_SUFFIX);
    }
  });
});
