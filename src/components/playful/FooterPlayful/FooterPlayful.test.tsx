import { render, screen } from "@testing-library/react";
import { FooterPlayful } from "./FooterPlayful";

it("renders a contentinfo landmark with one ruled cell per column", () => {
  render(<FooterPlayful columns={[<p key="a">A</p>, <p key="b">B</p>, <p key="c">C</p>]} />);
  const footer = screen.getByRole("contentinfo");
  const grid = footer.firstElementChild!;
  expect(grid).toHaveClass("grid-cols-1", "md:grid-cols-3", "gap-px", "bg-bh-rule");
  expect(grid.children).toHaveLength(3);
});

it("clamps more than 6 columns to 6 per row", () => {
  const cols = Array.from({ length: 8 }, (_, i) => <p key={i}>{i}</p>);
  render(<FooterPlayful columns={cols} />);
  expect(screen.getByRole("contentinfo").firstElementChild).toHaveClass("md:grid-cols-6");
});

it("renders an optional bottom row", () => {
  render(<FooterPlayful columns={[<p key="a">A</p>]} bottom="Made with too much caffeine" />);
  expect(screen.getByText("Made with too much caffeine")).toHaveClass("uppercase");
});
