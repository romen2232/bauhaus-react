import { render } from "@testing-library/react";
import { SkewBar } from "./SkewBar";

it("is a single decorative bar without a shadow colour", () => {
  const { container } = render(<SkewBar color="orange" />);
  const root = container.firstElementChild!;
  expect(root).toHaveAttribute("aria-hidden", "true");
  expect(container.querySelectorAll(".-skew-x-12")).toHaveLength(1);
});

it("adds an offset duplicate behind it with a shadow colour", () => {
  const { container } = render(<SkewBar color="orange" shadowColor="navy" label="Lorem" />);
  const bars = container.querySelectorAll(".-skew-x-12");
  expect(bars).toHaveLength(2);
  expect(bars[0]).toHaveClass("bg-bh-navy", "translate-x-2", "translate-y-2");
  expect(bars[1]).toHaveClass("bg-bh-orange");
  expect(bars[1]).toHaveTextContent("Lorem");
});
