import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "../routes";

function renderAt(path: string) {
  render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: [path] })} />);
}

beforeEach(() => {
  window.localStorage.clear();
});

test("sidebar lists get-started links and all eight component groups in order", () => {
  renderAt("/docs/getting-started/install");
  const nav = screen.getByRole("navigation", { name: "Documentation" });
  const headings = within(nav).getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
  expect(headings).toEqual([
    "Get started",
    "Actions",
    "Forms",
    "Overlays",
    "Navigation",
    "Data & charts",
    "Media & cards",
    "Layout & type",
    "Decoration",
  ]);
  for (const name of ["Install", "Theme & fonts", "Mixing looks", "Principles", "Colour"]) {
    expect(within(nav).getByRole("link", { name })).toBeInTheDocument();
  }
});

test("the current page is marked", () => {
  renderAt("/docs/getting-started/install");
  const nav = screen.getByRole("navigation", { name: "Documentation" });
  expect(within(nav).getByRole("link", { name: "Install" })).toHaveAttribute("aria-current", "page");
  expect(within(nav).getByRole("link", { name: "Colour" })).not.toHaveAttribute("aria-current");
});

test("the sidebar collapses behind a button on narrow screens", async () => {
  renderAt("/docs/colour");
  const toggle = screen.getByRole("button", { name: "Documentation menu" });
  expect(toggle).toHaveAttribute("aria-expanded", "false");
  await userEvent.click(toggle);
  expect(toggle).toHaveAttribute("aria-expanded", "true");
});
