import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ChipPlayful } from "./ChipPlayful";

it("is an ink pill label", () => {
  render(<ChipPlayful>August 2026</ChipPlayful>);
  expect(screen.getByText("August 2026").closest("span.rounded-full")).toHaveClass("bg-bh-ink", "text-bh-paper");
});

it("merges className and forwards ref", () => {
  const ref = createRef<HTMLSpanElement>();
  const { container } = render(
    <ChipPlayful className="x" ref={ref}>
      1 Day
    </ChipPlayful>,
  );
  expect(container.firstElementChild).toHaveClass("x");
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
