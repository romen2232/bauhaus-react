import { render, screen } from "@testing-library/react";
import { ProgressRule } from "./ProgressRule";

it("exposes progress when labelled", () => {
  render(<ProgressRule value={0.4} label="Slides" />);
  const bar = screen.getByRole("progressbar", { name: "Slides" });
  expect(bar).toHaveAttribute("aria-valuenow", "40");
  expect(bar).toHaveAttribute("aria-valuemin", "0");
  expect(bar).toHaveAttribute("aria-valuemax", "100");
});

it("is decorative without a label", () => {
  const { container } = render(<ProgressRule value={0.4} />);
  expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  expect(screen.queryByRole("progressbar")).toBeNull();
});

it.each([
  [-1, "0"],
  [2, "100"],
  [Number.NaN, "0"],
])("clamps %s to %s", (v, now) => {
  render(<ProgressRule value={v} label="p" />);
  expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", now);
});
