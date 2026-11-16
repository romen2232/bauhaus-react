import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CarouselBase, type CarouselBaseProps } from "./CarouselBase";

const k = { root: "r", viewport: "", track: "", slide: "", controls: "", pager: "" };

const ui = (n: number, props: Partial<CarouselBaseProps> = {}) =>
  render(
    <CarouselBase
      classes={k}
      label="Projects"
      renderButton={({ label, disabled, onClick }) => (
        <button type="button" aria-label={label} disabled={disabled} onClick={onClick} />
      )}
      {...props}
    >
      {Array.from({ length: n }, (_, i) => (
        <p key={i}>S{i + 1}</p>
      ))}
    </CarouselBase>,
  );

it("is a named carousel region", () => {
  ui(3);
  const region = screen.getByRole("region", { name: "Projects" });
  expect(region).toHaveAttribute("aria-roledescription", "carousel");
});

it("moves forward and announces the slide", async () => {
  ui(3);
  expect(screen.getByText("Slide 1 of 3")).toHaveAttribute("aria-live", "polite");
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByText("Slide 2 of 3")).toBeInTheDocument();
  expect(screen.getByRole("group", { name: "2 of 3" })).not.toHaveAttribute("aria-hidden");
  expect(screen.getByText("S1").closest("[aria-roledescription='slide']")).toHaveAttribute("aria-hidden", "true");
});

it("disables previous at the start and next at the end", async () => {
  ui(2);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Previous slide" }));
  expect(screen.getByText("Slide 1 of 2")).toBeInTheDocument();
});

it("keeps keyboard focus on the controls when an end button becomes disabled", async () => {
  ui(2);
  screen.getByRole("button", { name: "Next slide" }).focus();
  await userEvent.keyboard("{Enter}");
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Previous slide" })).toHaveFocus();
});

it("does not steal focus when the index changes from outside", () => {
  const outside = document.createElement("button");
  document.body.append(outside);
  outside.focus();
  const { rerender } = ui(3, { index: 0 });
  rerender(
    <CarouselBase
      classes={k}
      label="Projects"
      index={2}
      renderButton={({ label, disabled, onClick }) => (
        <button type="button" aria-label={label} disabled={disabled} onClick={onClick} />
      )}
    >
      <p>S1</p>
      <p>S2</p>
      <p>S3</p>
    </CarouselBase>,
  );
  expect(outside).toHaveFocus();
  outside.remove();
});

it("handles a single slide", () => {
  ui(1);
  expect(screen.getByRole("button", { name: "Previous slide" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Next slide" })).toBeDisabled();
  expect(screen.getByText("01 / 01")).toBeInTheDocument();
});

it("shows the pager counter", async () => {
  ui(5);
  expect(screen.getByText("01 / 05")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByText("02 / 05")).toBeInTheDocument();
});

it("is controllable", async () => {
  const onIndexChange = vi.fn();
  ui(3, { index: 0, onIndexChange });
  await userEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(onIndexChange).toHaveBeenCalledWith(1);
  expect(screen.getByText("Slide 1 of 3")).toBeInTheDocument();
});

it("starts at defaultIndex and merges className", () => {
  ui(3, { defaultIndex: 2, className: "x" });
  expect(screen.getByText("Slide 3 of 3")).toBeInTheDocument();
  expect(screen.getByRole("region")).toHaveClass("r", "x");
});
