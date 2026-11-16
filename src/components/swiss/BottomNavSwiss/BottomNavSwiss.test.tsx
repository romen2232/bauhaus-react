import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { BottomNavSwiss } from "./BottomNavSwiss";

const items = [
  { href: "/", label: "Home", icon: "⌂", current: true },
  { href: "/payments", label: "Pay", icon: "+" },
];

it("is a labelled navigation marking only the current page", () => {
  render(<BottomNavSwiss label="Main" items={items} />);
  expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Pay" })).not.toHaveAttribute("aria-current");
  expect(screen.getAllByRole("link", { current: "page" })).toHaveLength(1);
});

it("gives every link a non-colour current-page top rule", () => {
  render(<BottomNavSwiss label="Main" items={items} showLabels />);
  for (const link of screen.getAllByRole("link")) {
    expect(link).toHaveClass(
      "aria-[current=page]:border-bh-ink",
      "aria-[current=page]:text-bh-ink",
      "text-bh-muted-text",
    );
  }
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLElement>();
  render(<BottomNavSwiss label="Main" items={items} className="fixed" ref={ref} />);
  expect(screen.getByRole("navigation")).toHaveClass("fixed");
  expect(ref.current).toBe(screen.getByRole("navigation"));
});
