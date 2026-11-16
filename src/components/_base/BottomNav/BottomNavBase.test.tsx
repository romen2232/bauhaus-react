import { render, screen } from "@testing-library/react";
import { BottomNavBase } from "./BottomNavBase";

const classes = { root: "r", list: "", item: "", link: "", icon: "i", label: "" };
const items = [
  { href: "/", label: "Home", icon: "⌂", current: true },
  { href: "/s", label: "Search", icon: "⌕" },
];

it("is a named navigation landmark that marks only the current page", () => {
  render(<BottomNavBase classes={classes} label="Main" items={items} />);
  expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  expect(screen.getByRole("link", { name: "Search" })).not.toHaveAttribute("aria-current");
});

it("hides icons from assistive tech and labels visually only when asked", () => {
  const { rerender } = render(<BottomNavBase classes={classes} label="Main" items={items} />);
  expect(screen.getByText("⌂")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("Home")).toHaveClass("sr-only");
  rerender(<BottomNavBase classes={classes} label="Main" items={items} showLabels />);
  expect(screen.getByText("Home")).not.toHaveClass("sr-only");
});

it("merges className after the root slot", () => {
  render(<BottomNavBase classes={classes} label="Main" items={items} className="x" />);
  expect(screen.getByRole("navigation")).toHaveClass("r", "x");
});
