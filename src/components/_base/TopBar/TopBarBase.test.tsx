import { render, screen } from "@testing-library/react";
import { TopBarBase } from "./TopBarBase";

const classes = { root: "r", brand: "b", meta: "m", action: "a" };

it("renders a banner with brand, meta and action in order", () => {
  render(<TopBarBase classes={classes} brand="Brand" meta={["One", "Two"]} action={<button type="button">Menu</button>} />);
  const banner = screen.getByRole("banner");
  expect(Array.from(banner.children).map((c) => c.textContent)).toEqual(["Brand", "One", "Two", "Menu"]);
  expect(banner.children[1]).toHaveClass("m");
  expect(banner.children[3]).toHaveClass("a");
});

it("omits the action cell when there is no action", () => {
  render(<TopBarBase classes={classes} brand="Brand" />);
  expect(screen.getByRole("banner").children).toHaveLength(1);
});

it("merges className after the root slot", () => {
  render(<TopBarBase classes={classes} brand="B" className="x" />);
  expect(screen.getByRole("banner")).toHaveClass("r", "x");
});
