import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ChipSoft } from "./ChipSoft";

it("is an ink pill with a hidden icon", () => {
  const { container } = render(<ChipSoft icon="★">Double Room</ChipSoft>);
  expect(screen.getByText("Double Room").closest("span.rounded-full")).toHaveClass("bg-bh-ink", "text-bh-paper");
  expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent("★");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLSpanElement>();
  render(<ChipSoft className="mr-2" ref={ref}>1 Day</ChipSoft>);
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  expect(ref.current).toHaveClass("mr-2");
});
