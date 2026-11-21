import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { LookProvider } from "../look/LookContext";
import { ComponentPage } from "./ComponentPage";
import type { DocEntry } from "./registry/types";

const probe = (look: string) => (p: Record<string, unknown>) => (
  <output data-testid={`probe-${look}`}>{`${look}:${String(p.disabled)}:${String(p.label)}`}</output>
);

const entry: DocEntry = {
  slug: "button",
  title: "Button",
  group: "Actions",
  purpose: "Triggers an action.",
  principles: ["p2", "p9"],
  looks: {
    playful: { exportName: "ButtonPlayful", demo: probe("playful"), snippet: "<ButtonPlayful>Go</ButtonPlayful>" },
    swiss: { exportName: "ButtonSwiss", demo: probe("swiss"), snippet: "<ButtonSwiss>Go</ButtonSwiss>" },
    soft: { exportName: "ButtonSoft", demo: probe("soft"), snippet: "<ButtonSoft>Go</ButtonSoft>" },
  },
  controls: [
    { prop: "disabled", kind: "boolean", initial: false },
    { prop: "label", kind: "text", initial: "Save" },
  ],
  dos: ["Use one primary button per view."],
  donts: ["Do not put a soft button beside sharp ones."],
  a11y: ["Keyboard: Enter and Space activate."],
};

const agnostic: DocEntry = {
  slug: "grid",
  title: "Grid",
  group: "Layout & type",
  purpose: "Lays out children.",
  principles: ["p8"],
  agnostic: { exportNames: ["Grid"], demo: () => <p>grid demo</p>, snippet: "<Grid cols={3} />" },
  controls: [],
  dos: [],
  donts: [],
  a11y: [],
};

function renderPage(e: DocEntry, search = "") {
  return render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <LookProvider>
        <ComponentPage entry={e} />
      </LookProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

test("mix shows one row per look, in order, each with its export name and snippet", () => {
  renderPage(entry);
  const rows = screen.getAllByTestId("look-row");
  expect(rows.map((r) => r.getAttribute("aria-label"))).toEqual(["Playful", "Swiss", "Soft"]);
  expect(within(rows[0]!).getByText("ButtonPlayful")).toBeInTheDocument();
  expect(within(rows[2]!).getByText("<ButtonSoft>Go</ButtonSoft>")).toBeInTheDocument();
  expect(within(rows[1]!).getByText("<ButtonSwiss>Go</ButtonSwiss>").closest("pre")).not.toBeNull();
});

test("a single look filters to its row and enlarges it", () => {
  renderPage(entry, "?look=soft");
  const rows = screen.getAllByTestId("look-row");
  expect(rows).toHaveLength(1);
  expect(rows[0]).toHaveAttribute("aria-label", "Soft");
  expect(rows[0]).toHaveAttribute("data-size", "large");
});

test("the soft row is its own rounded container; sharp rows are not rounded", () => {
  renderPage(entry);
  const [playful, swiss, soft] = screen.getAllByTestId("look-row");
  expect(soft!.className).toContain("rounded-bh-soft");
  expect(playful!.className).not.toMatch(/rounded-(?!none)/);
  expect(swiss!.className).not.toMatch(/rounded-(?!none)/);
});

test("a look the component lacks shows a note", () => {
  const { soft: _soft, ...withoutSoft } = entry.looks!;
  renderPage({ ...entry, looks: withoutSoft }, "?look=soft");
  expect(screen.getByText("Not available in this look")).toBeInTheDocument();
});

test.each(["", "?look=swiss", "?look=soft"])("agnostic entries have one row (%s)", (search) => {
  renderPage(agnostic, search);
  expect(screen.getAllByTestId("look-row")).toHaveLength(1);
  expect(screen.getByText("grid demo")).toBeInTheDocument();
});

test("the playground updates every visible row", async () => {
  renderPage(entry);
  await userEvent.click(screen.getByRole("checkbox", { name: "disabled" }));
  for (const look of ["playful", "swiss", "soft"]) {
    expect(screen.getByTestId(`probe-${look}`)).toHaveTextContent(`${look}:true:Save`);
  }
  const label = screen.getByRole("textbox", { name: "label" });
  await userEvent.clear(label);
  await userEvent.type(label, "Send");
  expect(screen.getByTestId("probe-swiss")).toHaveTextContent("swiss:true:Send");
});

test("the props table lists own props and counts inherited DOM props", () => {
  renderPage(entry);
  const props = screen.getByRole("region", { name: "Props" });
  expect(within(props).getAllByRole("table").length).toBeGreaterThan(0);
  expect(within(props).getAllByRole("cell", { name: "color" }).length).toBeGreaterThan(0);
  expect(within(props).getAllByText(/Inherits \d+ DOM props/).length).toBeGreaterThan(0);
});

test("do / don't and accessibility sections render", () => {
  renderPage(entry);
  expect(screen.getByText("Use one primary button per view.")).toBeInTheDocument();
  expect(screen.getByText("Do not put a soft button beside sharp ones.")).toBeInTheDocument();
  expect(screen.getByText("Keyboard: Enter and Space activate.")).toBeInTheDocument();
});

test("principle tags link to the principles page", () => {
  renderPage(entry);
  expect(screen.getByRole("link", { name: /P2/ })).toHaveAttribute("href", "/docs/principles#p2");
});

test("on this page lists the visible sections", () => {
  renderPage(entry);
  const toc = screen.getByRole("navigation", { name: "On this page" });
  const names = within(toc).getAllByRole("link").map((a) => a.textContent);
  expect(names).toEqual(["Playful", "Swiss", "Soft", "Playground", "Props", "Do / Don't", "Accessibility"]);
});

test("on this page follows the selected look", () => {
  renderPage(entry, "?look=swiss");
  const toc = screen.getByRole("navigation", { name: "On this page" });
  expect(within(toc).getAllByRole("link").map((a) => a.textContent)).toEqual([
    "Swiss",
    "Playground",
    "Props",
    "Do / Don't",
    "Accessibility",
  ]);
});
