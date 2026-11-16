import { render, screen } from "@testing-library/react";
import { IndexCounter } from "./IndexCounter";

it("pads and announces position", () => {
  render(<IndexCounter current={1} total={5} />);
  expect(screen.getByText("01 / 05")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByText("1 of 5")).toHaveClass("sr-only");
});

it("respects pad and works without a total", () => {
  render(<IndexCounter current={7} pad={3} />);
  expect(screen.getByText("007")).toBeInTheDocument();
  expect(screen.getByText("7")).toHaveClass("sr-only");
});

it("merges className onto the root", () => {
  const { container } = render(<IndexCounter current={1} className="x" />);
  expect(container.firstElementChild).toHaveClass("x");
});
