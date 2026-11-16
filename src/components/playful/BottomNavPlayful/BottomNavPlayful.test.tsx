import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { BottomNavPlayful } from "./BottomNavPlayful";

const items = [
  { href: "/", label: "Home", icon: "⌂", current: true },
  { href: "/s", label: "Search", icon: "⌕" },
];

it("is a named nav whose current link gets the yellow pill", () => {
  render(<BottomNavPlayful label="Main" items={items} />);
  expect(screen.getByRole("navigation", { name: "Main" })).toHaveClass("bg-bh-ink");
  expect(screen.getByRole("link", { name: "Home" })).toHaveClass("aria-[current=page]:bg-bh-yellow");
});

it("merges className and forwards ref", () => {
  const ref = createRef<HTMLElement>();
  render(<BottomNavPlayful label="Main" items={items} className="x" ref={ref} />);
  expect(screen.getByRole("navigation")).toHaveClass("x");
  expect(ref.current?.tagName).toBe("NAV");
});
