import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarouselSoft } from "./CarouselSoft";

const ui = (n: number, className?: string) =>
  render(
    <CarouselSoft label="Rooms" className={className}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i}>Room {i + 1}</div>
      ))}
    </CarouselSoft>,
  );

it("is a named carousel region", () => {
  ui(3);
  expect(screen.getByRole("region", { name: "Rooms" })).toHaveAttribute("aria-roledescription", "carousel");
});

it("advances with the Soft next button and announces the slide", async () => {
  ui(3);
  const next = screen.getByRole("button", { name: "Next slide" });
  expect(next).toHaveClass("bg-bh-charcoal", "rounded-full");
  await userEvent.click(next);
  expect(screen.getByText("Slide 2 of 3")).toBeInTheDocument();
});

it("disables both buttons with one slide", () => {
  ui(1);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
});

it("merges className onto the root", () => {
  ui(2, "mt-8");
  expect(screen.getByRole("region")).toHaveClass("mt-8");
});
