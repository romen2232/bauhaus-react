import { render, screen } from "@testing-library/react";
import { Container } from "./Container";

it("renders a div by default with gutters", () => {
  render(<Container data-testid="c">x</Container>);
  const el = screen.getByTestId("c");
  expect(el.tagName).toBe("DIV");
  expect(el).toHaveClass("mx-auto", "max-w-7xl", "px-4");
});

it("renders the element given in `as`", () => {
  render(<Container as="main">x</Container>);
  expect(screen.getByRole("main")).toBeInTheDocument();
});

it("lets className override its own classes", () => {
  render(<Container data-testid="c" className="max-w-3xl">x</Container>);
  const el = screen.getByTestId("c");
  expect(el).toHaveClass("max-w-3xl");
  expect(el).not.toHaveClass("max-w-7xl");
});
