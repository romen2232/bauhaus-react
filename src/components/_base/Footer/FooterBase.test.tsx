import { render, screen } from "@testing-library/react";
import { FooterBase } from "./FooterBase";

const classes = { root: "r", grid: "g", column: "c", bottom: "bt" };

it("renders a contentinfo landmark with one cell per column", () => {
  render(<FooterBase classes={classes} columns={["A", "B", "C"]} />);
  const grid = screen.getByRole("contentinfo").firstElementChild!;
  expect(grid).toHaveClass("g");
  expect(Array.from(grid.children).map((c) => c.textContent)).toEqual(["A", "B", "C"]);
});

it("renders the bottom row after the grid", () => {
  render(<FooterBase classes={classes} columns={["A"]} bottom="Fine print" />);
  const footer = screen.getByRole("contentinfo");
  expect(footer.lastElementChild).toHaveTextContent("Fine print");
  expect(footer.lastElementChild).toHaveClass("bt");
});

it("merges className after the root slot", () => {
  render(<FooterBase classes={classes} columns={["A"]} className="x" />);
  expect(screen.getByRole("contentinfo")).toHaveClass("r", "x");
});
