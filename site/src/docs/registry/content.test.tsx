import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { LookProvider } from "../../look/LookContext";
import { ComponentPage } from "../ComponentPage";
import { REGISTRY } from "./index";
import { GROUPS, type Group } from "./types";

// Updated as each group is written (Tasks 10-12): the final counts cover the whole catalogue.
const EXPECTED: Record<Group, number> = {
  Actions: 5,
  Forms: 8,
  Overlays: 3,
  Navigation: 7,
  "Data & charts": 10,
  "Media & cards": 0,
  "Layout & type": 0,
  Decoration: 0,
};

const SEARCHES = ["", "?look=playful", "?look=swiss", "?look=soft"];

beforeEach(() => {
  window.localStorage.clear();
});

test.each(GROUPS)("group %s has the planned entries", (group) => {
  expect(REGISTRY.filter((e) => e.group === group)).toHaveLength(EXPECTED[group]);
});

test.each(REGISTRY.map((e) => [e.slug, e] as const))("%s has complete content", (_slug, entry) => {
  expect(entry.purpose.length).toBeGreaterThan(10);
  expect(entry.principles.length).toBeGreaterThan(0);
  expect(entry.dos.length).toBeGreaterThan(0);
  expect(entry.donts.length).toBeGreaterThan(0);
  expect(entry.a11y.length).toBeGreaterThan(0);
  expect(entry.looks ? Object.keys(entry.looks).sort() : ["agnostic"]).toEqual(
    entry.looks ? ["playful", "soft", "swiss"] : ["agnostic"],
  );
});

describe.each(REGISTRY.map((e) => [e.slug, e] as const))("%s", (_slug, entry) => {
  test.each(SEARCHES)("renders without errors (%s)", (search) => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={[`/${search}`]}>
        <LookProvider>
          <ComponentPage entry={entry} />
        </LookProvider>
      </MemoryRouter>,
    );
    for (const demo of screen.getAllByTestId("demo")) expect(demo.children.length).toBeGreaterThan(0);
    expect(error.mock.calls.map((c) => String(c[0]).slice(0, 220))).toEqual([]);
    error.mockRestore();
  });
});
