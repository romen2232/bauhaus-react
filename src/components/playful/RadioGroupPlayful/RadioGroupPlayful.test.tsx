import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { RadioGroupPlayful } from "./RadioGroupPlayful";

const options = [
  { value: "a", label: "Email" },
  { value: "b", label: "Phone" },
];
const circle = (c: HTMLElement) => c.querySelector("[aria-hidden]")!;

it("is a named, required radio group", () => {
  render(<RadioGroupPlayful label="Contact by" options={options} isRequired />);
  expect(screen.getByRole("radiogroup", { name: /Contact by/ })).toHaveAttribute("aria-required", "true");
});

it("shows an invalid message in non-red text with a marker, and the circles do not change", () => {
  const valid = render(<RadioGroupPlayful label="Via" options={options} />);
  const validCircle = circle(valid.container).className;
  valid.unmount();
  const { container } = render(<RadioGroupPlayful label="Via" options={options} isInvalid errorMessage="Pick one" />);
  const msg = screen.getByText("Pick one");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marks = container.querySelectorAll("[aria-hidden]");
  expect(marks[0]!.className).toBe(validCircle);
  expect(marks[marks.length - 1]!).toHaveClass("bg-bh-red");
});

it("defaults to an ink fill and honours color", () => {
  const a = render(<RadioGroupPlayful label="A" options={options} />);
  expect(circle(a.container).className).toContain("data-[checked]:bg-bh-ink");
  a.unmount();
  const b = render(<RadioGroupPlayful label="A" options={options} color="blue" />);
  expect(circle(b.container).className).toContain("data-[checked]:bg-bh-blue");
});

it("has the look circle: 2px ink border, round, paper-white off, dot follows the text colour", () => {
  const { container } = render(<RadioGroupPlayful label="A" options={options} defaultValue="a" />);
  for (const c of ["border-2", "border-bh-ink", "rounded-full", "bg-bh-paper-white"]) {
    expect(circle(container)).toHaveClass(c);
  }
  expect(circle(container).firstElementChild!).toHaveClass("bg-current");
});

it("merges className onto the root", () => {
  render(<RadioGroupPlayful label="A" options={options} className="mt-4" />);
  expect(screen.getByRole("radiogroup")).toHaveClass("mt-4");
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<RadioGroupPlayful label="A" options={options} ref={ref} />);
  expect(ref.current).toBe(screen.getByRole("radiogroup"));
});
