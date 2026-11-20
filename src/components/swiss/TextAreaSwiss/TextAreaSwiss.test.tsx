import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextAreaSwiss } from "./TextAreaSwiss";

it("is a named, required textbox", () => {
  render(<TextAreaSwiss label="Notes" isRequired />);
  expect(screen.getByRole("textbox", { name: /Notes/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker", () => {
  const { container } = render(<TextAreaSwiss label="Notes" isInvalid errorMessage="Enter some notes" />);
  const msg = screen.getByText("Enter some notes");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marker = container.querySelector("[aria-hidden]");
  expect(marker).toBeNull();
  expect(screen.getByRole("textbox")).toHaveClass("data-[invalid]:border-bh-accent");
});

it("has the look's field surface", () => {
  render(<TextAreaSwiss label="Notes" />);
  const input = screen.getByRole("textbox");
  for (const c of ["border-b", "border-bh-ink", "bg-transparent"]) expect(input).toHaveClass(c);
  expect(input.className).not.toMatch(/border-2|rounded-(?!none)/);
});

it("merges className onto the root", () => {
  render(<TextAreaSwiss label="Notes" className="mt-4" />);
  expect(screen.getByRole("textbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TextAreaSwiss label="Notes" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("textbox"))).toBe(true);
});

it("lets the textarea grow: h-auto wins over h-11", () => {
  render(<TextAreaSwiss label="Notes" />);
  const input = screen.getByRole("textbox");
  expect(input.className).not.toMatch(/(^|\s)h-11(\s|$)/);
  expect(input).toHaveClass("h-auto", "min-h-24");
});
