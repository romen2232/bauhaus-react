import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { LookProvider } from "../look/LookContext";
import { LandingPage } from "./LandingPage";
import { PRINCIPLES } from "./PrinciplesStrip";

function renderLanding(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <LookProvider>
        <LandingPage />
      </LookProvider>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

test("sections appear in the planned order", () => {
  const { container } = renderLanding();
  const order = [
    screen.getByRole("heading", { level: 1 }),
    container.querySelector('[aria-hidden="true"].grid'), // mosaic band
    screen.getByTestId("look-bands"),
    screen.getByRole("region", { name: "Principles" }),
    screen.getByRole("region", { name: "Install in 3 steps" }),
    screen.getByRole("link", { name: "Read the docs" }),
  ];
  for (let i = 0; i < order.length - 1; i++) {
    expect(order[i]!.compareDocumentPosition(order[i + 1]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
});

test("mix shows three bands", () => {
  renderLanding();
  const bands = screen.getByTestId("look-bands");
  for (const name of ["Playful", "Swiss", "Soft"]) {
    expect(within(bands).getByRole("region", { name })).toBeInTheDocument();
  }
});

test("a single look shows one large band", () => {
  renderLanding("?look=swiss");
  const bands = screen.getByTestId("look-bands");
  expect(within(bands).getAllByRole("region")).toHaveLength(1);
  expect(within(bands).getByRole("region", { name: "Swiss" })).toHaveAttribute("data-size", "large");
});

test("soft band is isolated in its own rounded container", () => {
  renderLanding();
  const bands = screen.getByTestId("look-bands");
  const soft = within(bands).getByRole("region", { name: "Soft" });
  expect(soft.parentElement).toBe(bands);
  expect(soft.className).toContain("rounded-bh-soft");
  for (const name of ["Playful", "Swiss"]) {
    expect(within(bands).getByRole("region", { name }).className).not.toMatch(/rounded-(?!none)/);
  }
});

test("principles strip links to all eleven principles", () => {
  renderLanding();
  const strip = screen.getByRole("region", { name: "Principles" });
  const links = within(strip).getAllByRole("link");
  expect(links).toHaveLength(11);
  expect(links[0]).toHaveAttribute("href", "/docs/principles#p1");
  expect(links[10]).toHaveAttribute("href", "/docs/principles#p11");
  expect(PRINCIPLES.map((p) => p.id)).toEqual(Array.from({ length: 11 }, (_, i) => `p${i + 1}`));
});

test("install steps show the three commands", () => {
  renderLanding();
  const install = screen.getByRole("region", { name: "Install in 3 steps" });
  const text = install.textContent ?? "";
  expect(text).toContain("pnpm add bauhaus-react");
  expect(text).toContain('@import "bauhaus-react/theme.css";');
  expect(text).toContain('import { ButtonPlayful } from "bauhaus-react"');
  expect(within(install).getAllByRole("button", { name: /copy/i })).toHaveLength(3);
});

test.each(["", "?look=playful", "?look=swiss", "?look=soft"])("renders without React warnings (%s)", (search) => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  renderLanding(search);
  expect(error.mock.calls.map((c) => String(c[0]).slice(0, 160))).toEqual([]);
  error.mockRestore();
});

test("soft charts sit on paper cards, not charcoal (their marks are drawn for light grounds)", () => {
  renderLanding("?look=soft");
  const soft = screen.getByRole("region", { name: "Soft" });
  for (const title of ["Sessions this week", "Traffic sources"]) {
    const card = within(soft).getAllByText(title)[0]!.closest("article");
    expect(card, title).toHaveClass("bg-bh-paper");
    expect(card, title).not.toHaveClass("bg-bh-charcoal");
  }
});
