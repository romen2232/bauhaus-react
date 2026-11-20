import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { RadioGroupSwiss } from "./RadioGroupSwiss";

const options = [
  { value: "a", label: "Email" },
  { value: "b", label: "Phone" },
];
const circle = (c: HTMLElement) => c.querySelector("[aria-hidden]")!;

it("is a named, required radio group", () => {
  render(<RadioGroupSwiss label="Contact by" options={options} isRequired />);
  expect(screen.getByRole("radiogroup", { name: /Contact by/ })).toHaveAttribute("aria-required", "true");
});

it("shows an invalid message in non-red text with a marker, and the circles do not change", () => {
  const valid = render(<RadioGroupSwiss label="Via" options={options} />);
  const validCircle = circle(valid.container).className;
  valid.unmount();
  const { container } = render(<RadioGroupSwiss label="Via" options={options} isInvalid errorMessage="Pick one" />);
  const msg = screen.getByText("Pick one");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marks = container.querySelectorAll("[aria-hidden]");
  expect(marks[0]!.className).toBe(validCircle);
  expect(marks[marks.length - 1]!).toHaveClass("bg-bh-accent");
});

it("has the look circle: 1px ink border, round (flagged pill), ink when on", () => {
  const { container } = render(<RadioGroupSwiss label="A" options={options} />);
  for (const c of ["border", "border-bh-ink", "rounded-full", "bg-transparent", "data-[checked]:bg-bh-ink"]) {
    expect(circle(container)).toHaveClass(c);
  }
  expect(circle(container).className).not.toMatch(/translate/);
});

it("has exactly one bh-accent token when invalid", () => {
  const { container } = render(<RadioGroupSwiss label="Via" options={options} isInvalid errorMessage="Required" />);
  const count = [...container.querySelectorAll("*")]
    .flatMap((el) => (el.getAttribute("class") ?? "").split(/\s+/))
    .filter((c) => c.includes("bh-accent")).length;
  expect(count).toBe(1);
});

it("merges className onto the root", () => {
  render(<RadioGroupSwiss label="A" options={options} className="mt-4" />);
  expect(screen.getByRole("radiogroup")).toHaveClass("mt-4");
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<RadioGroupSwiss label="A" options={options} ref={ref} />);
  expect(ref.current).toBe(screen.getByRole("radiogroup"));
});
