import { render } from "@testing-library/react";
import { Ribbon } from "./Ribbon";

it("is decorative and repeats its text 8 times", () => {
  const { container } = render(<Ribbon text="Lorem" />);
  const root = container.firstElementChild!;
  expect(root).toHaveAttribute("aria-hidden", "true");
  expect(root.textContent!.split("Lorem")).toHaveLength(9);
});

it("rotates by the angle (default -12) and fills with the colour", () => {
  const { container, rerender } = render(<Ribbon text="Lorem" />);
  const band = () => container.querySelector(".bg-bh-red, .bg-bh-blue");
  expect(band()).toHaveClass("-rotate-12", "bg-bh-red");
  rerender(<Ribbon text="Lorem" angle={6} color="blue" />);
  expect(band()).toHaveClass("rotate-6", "bg-bh-blue");
});
