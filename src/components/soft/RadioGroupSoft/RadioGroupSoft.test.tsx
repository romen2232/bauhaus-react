import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { RadioGroupSoft } from "./RadioGroupSoft";

const options = [
  { value: "a", label: "Email" },
  { value: "b", label: "Phone" },
];
const circle = (c: HTMLElement) => c.querySelector("[aria-hidden]")!;

it("is a named, required radio group", () => {
  render(<RadioGroupSoft label="Contact by" options={options} isRequired />);
  expect(screen.getByRole("radiogroup", { name: /Contact by/ })).toHaveAttribute("aria-required", "true");
});

it("shows an invalid message in non-red text with a dot marker, and the circles do not change", () => {
  const valid = render(<RadioGroupSoft label="Via" options={options} />);
  const validCircle = circle(valid.container).className;
  valid.unmount();
  const { container } = render(<RadioGroupSoft label="Via" options={options} isInvalid errorMessage="Pick one" />);
  const msg = screen.getByText("Pick one");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marks = container.querySelectorAll("[aria-hidden]");
  expect(marks[0]!.className).toBe(validCircle);
  expect(marks[marks.length - 1]!).toHaveClass("bg-bh-red", "rounded-full");
});

it("defaults to the neutral tone and honours tone", () => {
  const a = render(<RadioGroupSoft label="A" options={options} />);
  expect(circle(a.container).className).toContain("data-[checked]:bg-bh-charcoal");
  a.unmount();
  const b = render(<RadioGroupSoft label="A" options={options} tone="red" />);
  expect(circle(b.container).className).toContain("data-[checked]:bg-bh-red");
});

it("has the look circle: 1px charcoal outline, sand when off, round", () => {
  const { container } = render(<RadioGroupSoft label="A" options={options} />);
  for (const c of ["border", "border-bh-charcoal", "bg-bh-sand", "rounded-full"]) {
    expect(circle(container)).toHaveClass(c);
  }
  expect(circle(container).firstElementChild!).toHaveClass("bg-current");
});

it("merges className onto the root", () => {
  render(<RadioGroupSoft label="A" options={options} className="mt-4" />);
  expect(screen.getByRole("radiogroup")).toHaveClass("mt-4");
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<RadioGroupSoft label="A" options={options} ref={ref} />);
  expect(ref.current).toBe(screen.getByRole("radiogroup"));
});
