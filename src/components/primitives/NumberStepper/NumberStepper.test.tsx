import { render, screen } from "@testing-library/react";
import { NumberStepper } from "./NumberStepper";

it("ghosts the next two numbers by default", () => {
  render(<NumberStepper value={23} />);
  expect(screen.getByText("23").closest("[aria-hidden='true']")).toBeNull();
  expect(screen.getByText("24").closest("[aria-hidden='true']")).not.toBeNull();
  expect(screen.getByText("25").closest("[aria-hidden='true']")).not.toBeNull();
});

it("shows one ghost with ahead=1 and pads", () => {
  render(<NumberStepper value={7} ahead={1} pad={2} />);
  expect(screen.getByText("07")).toBeInTheDocument();
  expect(screen.getByText("08")).toBeInTheDocument();
  expect(screen.queryByText("09")).toBeNull();
});
