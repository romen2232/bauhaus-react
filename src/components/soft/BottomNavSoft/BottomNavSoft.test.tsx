import { createRef } from "react";
import { render, screen } from "@testing-library/react";
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

it("uses the tone for the current dot", () => {
  render(<BottomNavSoft label="Main" items={items} tone="blue" />);
  expect(screen.getByRole("link", { name: "Home" })).toHaveClass("aria-[current=page]:after:bg-bh-blue");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<BottomNavSoft label="Main" items={items} className="fixed" ref={ref} />);
  expect(screen.getByRole("navigation")).toHaveClass("fixed");
  expect(ref.current).toBe(screen.getByRole("navigation"));
});
