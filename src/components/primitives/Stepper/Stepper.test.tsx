import { render, screen, within } from "@testing-library/react";
import { Stepper } from "./Stepper";

const steps = [{ label: "Arrive" }, { label: "Stay", color: "red" as const }, { label: "Leave" }];

it("marks only the current step", () => {
  render(<Stepper current={1} steps={steps} />);
  const items = screen.getAllByRole("listitem");
  expect(items[1]).toHaveAttribute("aria-current", "step");
  expect(items[0]).not.toHaveAttribute("aria-current");
  expect(items[2]).not.toHaveAttribute("aria-current");
});

it("numbers the steps from 1", () => {
  render(<Stepper current={0} steps={steps} />);
  const items = screen.getAllByRole("listitem");
  expect(within(items[2]!).getByText("3")).toBeInTheDocument();
  expect(within(items[2]!).getByText("Leave")).toBeInTheDocument();
});
