import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CheckboxSoft } from "./CheckboxSoft";

it("is a named, required checkbox", () => {
  render(<CheckboxSoft label="Subscribe" isRequired />);
  expect(screen.getByRole("checkbox", { name: /Subscribe/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker, and the box does not change", () => {
  const valid = render(<CheckboxSoft label="Terms" />);
  const validBox = valid.container.querySelector("[aria-hidden]")!.className;
  valid.unmount();
  const { container } = render(<CheckboxSoft label="Terms" isInvalid errorMessage="Accept to continue" />);
  const msg = screen.getByText("Accept to continue");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const boxes = container.querySelectorAll("[aria-hidden]");
  expect(boxes[0]!.className).toBe(validBox);
  const marker = boxes[boxes.length - 1]!;
  expect(marker).toHaveClass("bg-bh-red", "rounded-full");
});

it("defaults to a neutral tone and honours tone", () => {
  const a = render(<CheckboxSoft label="A" />);
  expect(a.container.querySelector("[aria-hidden]")!.className).toContain("data-[checked]:bg-bh-charcoal");
  a.unmount();
  const b = render(<CheckboxSoft label="A" tone="blue" />);
  expect(b.container.querySelector("[aria-hidden]")!.className).toContain("data-[checked]:bg-bh-blue");
});

it("has the look box: 1px charcoal outline on sand", () => {
  const { container } = render(<CheckboxSoft label="A" />);
  const box = container.querySelector("[aria-hidden]")!;
  for (const c of ["border", "border-bh-charcoal", "bg-bh-sand", "rounded-md"]) expect(box).toHaveClass(c);
});

it("merges className onto the root", () => {
  render(<CheckboxSoft label="A" className="mt-4" />);
  expect(screen.getByRole("checkbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<CheckboxSoft label="A" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("checkbox"))).toBe(true);
});
