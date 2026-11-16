import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ChipSwiss } from "./ChipSwiss";

it("is a sharp outlined chip with a decorative icon", () => {
  const { container } = render(<ChipSwiss icon="◷">1 Day</ChipSwiss>);
  const chip = screen.getByText("1 Day");
  expect(chip).toHaveClass("border", "border-bh-ink");
  expect(chip.className).not.toMatch(/rounded/);
  expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("◷");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLSpanElement>();
  render(
    <ChipSwiss className="mr-2" ref={ref}>
      1 Day
    </ChipSwiss>,
  );
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  expect(ref.current).toHaveClass("mr-2");
});
