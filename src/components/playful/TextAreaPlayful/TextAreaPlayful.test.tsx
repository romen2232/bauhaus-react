import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextAreaPlayful } from "./TextAreaPlayful";

it("is a named, required textbox", () => {
  render(<TextAreaPlayful label="Notes" isRequired />);
  expect(screen.getByRole("textbox", { name: /Notes/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker", () => {
  const { container } = render(<TextAreaPlayful label="Notes" isInvalid errorMessage="Enter some notes" />);
  const msg = screen.getByText("Enter some notes");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marker = container.querySelector("[aria-hidden]");
  expect(marker).toHaveClass("bg-bh-red");
});

it("has the look's field surface", () => {
  render(<TextAreaPlayful label="Notes" />);
  const input = screen.getByRole("textbox");
  for (const c of ["border-2", "border-bh-ink", "rounded-none", "bg-bh-paper-white"]) expect(input).toHaveClass(c);
});

it("merges className onto the root", () => {
  render(<TextAreaPlayful label="Notes" className="mt-4" />);
  expect(screen.getByRole("textbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TextAreaPlayful label="Notes" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("textbox"))).toBe(true);
});

it("lets the textarea grow: h-auto wins over h-11", () => {
  render(<TextAreaPlayful label="Notes" />);
  const input = screen.getByRole("textbox");
  expect(input.className).not.toMatch(/(^|\s)h-11(\s|$)/);
  expect(input).toHaveClass("h-auto", "min-h-24");
});
