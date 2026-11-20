import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CheckboxSwiss } from "./CheckboxSwiss";

it("is a named, required checkbox", () => {
  render(<CheckboxSwiss label="Subscribe" isRequired />);
  expect(screen.getByRole("checkbox", { name: /Subscribe/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker, and the box does not change", () => {
  const valid = render(<CheckboxSwiss label="Terms" />);
  const validBox = valid.container.querySelector("[aria-hidden]")!.className;
  valid.unmount();
  const { container } = render(<CheckboxSwiss label="Terms" isInvalid errorMessage="Accept to continue" />);
  const msg = screen.getByText("Accept to continue");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const boxes = container.querySelectorAll("[aria-hidden]");
  expect(boxes[0]!.className).toBe(validBox);
  const marker = boxes[boxes.length - 1]!;
  expect(marker).toHaveClass("bg-bh-accent");
});

it("has the look box: 1px ink border, square, ink when checked", () => {
  const { container } = render(<CheckboxSwiss label="A" />);
  const box = container.querySelector("[aria-hidden]")!;
  for (const c of ["border", "border-bh-ink", "bg-transparent", "data-[checked]:bg-bh-ink"]) expect(box).toHaveClass(c);
  expect(box.className).not.toMatch(/rounded-(?!none)/);
});

it("merges className onto the root", () => {
  render(<CheckboxSwiss label="A" className="mt-4" />);
  expect(screen.getByRole("checkbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<CheckboxSwiss label="A" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("checkbox"))).toBe(true);
});

it("has exactly one bh-accent token when invalid", () => {
  const { container } = render(<CheckboxSwiss label="Terms" isInvalid errorMessage="Required" />);
  const count = [...container.querySelectorAll("*")]
    .flatMap((el) => (el.getAttribute("class") ?? "").split(/\s+/))
    .filter((c) => c.includes("bh-accent")).length;
  expect(count).toBe(1);
});
