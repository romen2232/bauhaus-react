import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SOFT_HEX } from "../../../lib/palette";
import { BottomNavSoft } from "./BottomNavSoft";

const items = [
  { href: "/", label: "Home", icon: "⌂", current: true },
  { href: "/book", label: "Book", icon: "+" },
];

it("is a labelled navigation marking only the current page", () => {
  render(<BottomNavSoft label="Main" items={items} />);
  expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Book" })).not.toHaveAttribute("aria-current");
});

it("defaults the current dot to yellow", () => {
  render(<BottomNavSoft label="Main" items={items} />);
  expect(screen.getByRole("link", { name: "Home" })).toHaveClass("aria-[current=page]:after:bg-bh-yellow");
});

it("has no tone prop: only yellow keeps the dot at 3:1 on the charcoal bar", () => {
  const lum = (hex: string) => {
    const [r, g, b] = [1, 3, 5].map((i) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a: string, b: string) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  expect(ratio(SOFT_HEX.yellow, SOFT_HEX.neutral)).toBeGreaterThanOrEqual(3);
  // @ts-expect-error tone was removed: red (2.4:1) and blue (1.7:1) dots fail non-text contrast on charcoal.
  render(<BottomNavSoft label="Main" items={items} tone="blue" />);
  expect(screen.getByRole("link", { name: "Home" })).toHaveClass("aria-[current=page]:after:bg-bh-yellow");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<BottomNavSoft label="Main" items={items} className="fixed" ref={ref} />);
  expect(screen.getByRole("navigation")).toHaveClass("fixed");
  expect(ref.current).toBe(screen.getByRole("navigation"));
});
