import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CheckboxPlayful } from "./CheckboxPlayful";

it("is a named, required checkbox", () => {
  render(<CheckboxPlayful label="Subscribe" isRequired />);
  expect(screen.getByRole("checkbox", { name: /Subscribe/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker, and the box does not change", () => {
  const valid = render(<CheckboxPlayful label="Terms" />);
  const validBox = valid.container.querySelector("[aria-hidden]")!.className;
  valid.unmount();
  const { container } = render(<CheckboxPlayful label="Terms" isInvalid errorMessage="Accept to continue" />);
  const msg = screen.getByText("Accept to continue");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const boxes = container.querySelectorAll("[aria-hidden]");
  expect(boxes[0]!.className).toBe(validBox);
  const marker = boxes[boxes.length - 1]!;
  expect(marker).toHaveClass("bg-bh-red");
});

it("defaults to an ink fill and honours color", () => {
  const a = render(<CheckboxPlayful label="A" />);
  expect(a.container.querySelector("[aria-hidden]")!.className).toContain("data-[checked]:bg-bh-ink");
  a.unmount();
  const b = render(<CheckboxPlayful label="A" color="red" />);
  expect(b.container.querySelector("[aria-hidden]")!.className).toContain("data-[checked]:bg-bh-red");
});

it("has the look box: 2px ink border, square", () => {
  const { container } = render(<CheckboxPlayful label="A" />);
  const box = container.querySelector("[aria-hidden]")!;
  for (const c of ["border-2", "border-bh-ink", "rounded-none", "bg-bh-paper-white"]) expect(box).toHaveClass(c);
});

it("merges className onto the root", () => {
  render(<CheckboxPlayful label="A" className="mt-4" />);
  expect(screen.getByRole("checkbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<CheckboxPlayful label="A" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("checkbox"))).toBe(true);
});
