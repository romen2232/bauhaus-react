import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { mockMatchMedia } from "../../../vitest.setup";
import { LookProvider } from "../../look/LookContext";
import { MosaicBand } from "./MosaicBand";

const REDUCED = "(prefers-reduced-motion: reduce)";

function renderBand(search = "") {
  return render(
    <MemoryRouter initialEntries={[`/${search}`]}>
      <LookProvider>
        <MosaicBand />
      </LookProvider>
    </MemoryRouter>,
  );
}

const tiles = () => screen.getAllByTestId("mosaic-tile");

beforeEach(() => {
  window.localStorage.clear();
});

test("is decorative", () => {
  const { container } = renderBand();
  expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
});

test("renders 12 x 4 tiles on desktop", () => {
  renderBand();
  expect(tiles()).toHaveLength(48);
});

test("uses fewer columns on narrow screens", () => {
  mockMatchMedia({ "(max-width: 767px)": true });
  const { unmount } = renderBand();
  expect(tiles()).toHaveLength(24);
  unmount();
  mockMatchMedia({ "(max-width: 479px)": true, "(max-width: 767px)": true });
  renderBand();
  expect(tiles()).toHaveLength(16);
});

test("follows the look palette", () => {
  const { container } = renderBand("?look=swiss");
  const hexes = [
    ...tiles().map((t) => t.getAttribute("data-ground")),
    ...[...container.querySelectorAll("[fill]")].map((el) => el.getAttribute("fill")),
  ];
  expect(hexes.length).toBeGreaterThan(48);
  expect(hexes).not.toContain("#1f5fd8");
  expect(hexes).not.toContain("#f5b62a");
});

test("rotates a tile on hover", async () => {
  renderBand();
  const tile = tiles()[0]!;
  const before = Number(tile.getAttribute("data-rotate"));
  await userEvent.hover(tile);
  expect(Number(tile.getAttribute("data-rotate"))).toBe(before + 90);
  expect(tile.querySelector("g")!.getAttribute("class")).toContain("transition-transform");
});

test("still rotates under reduced motion, without a transition", async () => {
  mockMatchMedia({ [REDUCED]: true });
  renderBand();
  const tile = tiles()[0]!;
  const before = Number(tile.getAttribute("data-rotate"));
  await userEvent.hover(tile);
  expect(Number(tile.getAttribute("data-rotate"))).toBe(before + 90);
  expect(tile.querySelector("g")!.getAttribute("class") ?? "").not.toContain("transition");
});

test("ripples in on load only with motion", () => {
  const { unmount } = renderBand();
  expect(tiles()[0]!.style.animationDelay).toBe("0ms");
  expect(tiles()[13]!.style.animationDelay).toBe("80ms"); // x=1, y=1
  unmount();
  mockMatchMedia({ [REDUCED]: true });
  renderBand();
  expect(tiles()[13]!.style.animationDelay).toBe("");
});
