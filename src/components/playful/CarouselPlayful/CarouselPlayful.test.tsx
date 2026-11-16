import { render, screen } from "@testing-library/react";
import { CarouselPlayful } from "./CarouselPlayful";

it("is a named region with Playful round controls", () => {
  render(
    <CarouselPlayful label="Projects" className="x">
      <p>One</p>
      <p>Two</p>
    </CarouselPlayful>,
  );
  expect(screen.getByRole("region", { name: "Projects" })).toHaveClass("x");
  expect(screen.getByRole("button", { name: "Next slide" })).toHaveClass("rounded-full", "border-2");
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
});
