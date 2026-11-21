import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../../routes";

function renderAt(path: string) {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("principles", () => {
  test("renders the research doc with stable anchors", () => {
    renderAt("/docs/principles");
    expect(screen.getByRole("heading", { level: 1, name: /Bauhaus Principles/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Unity of the arts, crafts and building" })).toHaveAttribute("id", "p1");
    expect(screen.getByRole("heading", { name: "Experiment and kinetic form" })).toHaveAttribute("id", "p11");
    for (let i = 1; i <= 11; i++) expect(document.getElementById(`p${i}`), `p${i}`).not.toBeNull();
  });

  test("renders the principle by look matrix as a table", () => {
    renderAt("/docs/principles");
    const tables = screen.getAllByRole("table");
    const matrix = tables.find((t) => within(t).queryByRole("columnheader", { name: "Playful" }));
    expect(matrix).toBeDefined();
    expect(within(matrix!).getAllByRole("row").length).toBeGreaterThan(11);
  });
});

describe("getting started", () => {
  test("install page shows the commands", () => {
    renderAt("/docs/getting-started/install");
    expect(screen.getByRole("heading", { level: 1, name: "Install" })).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).toContain("pnpm add bauhaus-react");
    expect(text).toContain('@source "../node_modules/bauhaus-react/dist";');
    expect(text).toContain('@import "bauhaus-react/theme.css";');
    expect(text).toMatch(/React 19/);
  });

  test("theme page shows the font setup", () => {
    renderAt("/docs/getting-started/theme");
    expect(screen.getByRole("heading", { level: 1, name: "Theme & fonts" })).toBeInTheDocument();
    const text = document.body.textContent ?? "";
    expect(text).toContain("pnpm add @fontsource/outfit @fontsource-variable/inter @fontsource/inter-tight");
    for (const line of [
      '@import "@fontsource/outfit/300.css";',
      '@import "@fontsource/outfit/400.css";',
      '@import "@fontsource/outfit/700.css";',
      '@import "@fontsource/outfit/800.css";',
      '@import "@fontsource-variable/inter";',
      '@import "@fontsource/inter-tight/400.css";',
    ]) {
      expect(text).toContain(line);
    }
  });

  test("mixing looks explains the corner rule with a live example", () => {
    renderAt("/docs/getting-started/mixing-looks");
    expect(screen.getByRole("heading", { name: "The corner rule" })).toBeInTheDocument();
    const sharp = screen.getByTestId("sharp-example");
    const soft = screen.getByTestId("soft-example");
    expect(within(sharp).getAllByRole("button").length).toBeGreaterThan(1);
    expect(sharp.querySelector(".rounded-bh-soft")).toBeNull();
    expect(soft.className).toContain("rounded-bh-soft");
    expect(within(soft).getAllByRole("button").length).toBeGreaterThan(0);
  });

  test("an unknown getting-started page is not found", () => {
    renderAt("/docs/getting-started/zzz");
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
  });
});

describe("colour", () => {
  test("shows the same swatch on four grounds and recolours all of them together", async () => {
    renderAt("/docs/colour");
    const grounds = screen.getAllByTestId("ground").map((g) => g.getAttribute("data-ground")!.toLowerCase());
    expect(grounds).toEqual(["#f4efe6", "#ffffff", "#111111", "#1f5fd8"]);
    const colours = () => screen.getAllByTestId("swatch").map((s) => s.getAttribute("data-color")!.toLowerCase());
    expect(colours()).toEqual(Array(4).fill("#ea4535"));
    await userEvent.click(screen.getByRole("radio", { name: "Yellow" }));
    expect(colours()).toEqual(Array(4).fill("#f5b62a"));
  });

  test("lists every fill token with its hex", () => {
    renderAt("/docs/colour");
    const table = screen.getByRole("table", { name: "Colour tokens" });
    for (const [name, hex] of [
      ["bh-red", "#ea4535"],
      ["bh-yellow", "#f5b62a"],
      ["bh-blue", "#1f5fd8"],
      ["bh-ink", "#111111"],
      ["bh-paper", "#f4efe6"],
    ]) {
      const row = within(table).getByRole("row", { name: new RegExp(`^${name}\\s`) });
      expect(row.textContent?.toLowerCase()).toContain(hex);
    }
  });

  test("states the form-colour pairing", () => {
    renderAt("/docs/colour");
    expect(screen.getByRole("heading", { name: /Form and colour/ })).toBeInTheDocument();
  });
});

describe("principles anchors", () => {
  test("scrolls to the hash target", () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    renderAt("/docs/principles#p5");
    expect(scrollIntoView).toHaveBeenCalled();
    expect(scrollIntoView.mock.contexts[0]).toBe(document.getElementById("p5"));
  });
});
