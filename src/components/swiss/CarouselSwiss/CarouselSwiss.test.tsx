import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarouselSwiss } from "./CarouselSwiss";

const ui = (n: number, className?: string) =>
  render(
    <CarouselSwiss label="Accounts" className={className}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i}>Account {i + 1}</div>
      ))}
    </CarouselSwiss>,
  );

it("is a named carousel region", () => {
  ui(3);
  expect(screen.getByRole("region", { name: "Accounts" })).toHaveAttribute(
    "aria-roledescription",
    "carousel",
  );
});

it("advances with the next button and announces the slide", async () => {
  ui(3);
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByText("Slide 2 of 3")).toBeInTheDocument();
});

it("disables both buttons with one slide", () => {
  ui(1);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
});

it("shows a grotesk index counter and hairline progress rule", () => {
  const { container } = ui(3);
  expect(screen.getByText("01 / 03")).toBeInTheDocument();
  expect(container.querySelector(".\\[\\&\\>span\\]\\:font-bh-grotesk")).not.toBeNull();
  expect(container.querySelector(".\\[\\&\\>div\\]\\:h-px")).not.toBeNull();
});

it("merges className onto the root", () => {
  ui(2, "mt-8");
  expect(screen.getByRole("region")).toHaveClass("mt-8");
});

it("forwards ref to the region", () => {
  const ref = createRef<HTMLElement>();
  render(
    <CarouselSwiss label="Accounts" ref={ref}>
      <div>Account A</div>
    </CarouselSwiss>,
  );
  expect(ref.current).toBe(screen.getByRole("region", { name: "Accounts" }));
});
