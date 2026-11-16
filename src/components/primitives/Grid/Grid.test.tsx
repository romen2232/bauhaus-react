import { render, screen } from "@testing-library/react";
import { Grid } from "./Grid";

it("defaults to 12 columns with a medium gap", () => {
  render(<Grid data-testid="g" />);
  expect(screen.getByTestId("g")).toHaveClass("grid", "grid-cols-12", "gap-6");
});

it("maps cols to a literal grid-cols class", () => {
  render(<Grid data-testid="g" cols={5} />);
  expect(screen.getByTestId("g")).toHaveClass("grid-cols-5");
});

it("ruled draws 1px inner rules and an outer border, ignoring gap", () => {
  render(<Grid data-testid="g" ruled gap="lg" />);
  const el = screen.getByTestId("g");
  expect(el).toHaveClass("gap-px", "bg-bh-rule", "border", "border-bh-rule");
  expect(el).not.toHaveClass("gap-10");
});

it("passes native props through", () => {
  render(<Grid aria-label="Projects" role="list" />);
  expect(screen.getByRole("list", { name: "Projects" })).toBeInTheDocument();
});
