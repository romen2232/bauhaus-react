import { createRef } from "react";
import { render } from "@testing-library/react";
import { StackCardPlayful } from "./StackCardPlayful";

it("colours the spine (red by default)", () => {
  const { container, rerender } = render(<StackCardPlayful>Room</StackCardPlayful>);
  expect(container.querySelector("[aria-hidden='true']")).toHaveClass("bg-bh-red");
  rerender(<StackCardPlayful color="blue">Room</StackCardPlayful>);
  expect(container.querySelector("[aria-hidden='true']")).toHaveClass("bg-bh-blue");
});

it("merges className and forwards ref", () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <StackCardPlayful className="x" ref={ref}>
      Room
    </StackCardPlayful>,
  );
  expect(container.firstElementChild).toHaveClass("x");
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
});
