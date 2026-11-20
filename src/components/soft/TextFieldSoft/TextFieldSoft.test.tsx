import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextFieldSoft } from "./TextFieldSoft";

it("is a named, required textbox", () => {
  render(<TextFieldSoft label="Email" isRequired />);
  expect(screen.getByRole("textbox", { name: /Email/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker", () => {
  const { container } = render(<TextFieldSoft label="Email" isInvalid errorMessage="Enter a valid email" />);
  const msg = screen.getByText("Enter a valid email");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marker = container.querySelector("[aria-hidden]");
  expect(marker).toHaveClass("bg-bh-red");
});

it("has the look's field surface", () => {
  render(<TextFieldSoft label="Email" />);
  const input = screen.getByRole("textbox");
  for (const c of ["rounded-full", "bg-bh-sand", "border", "border-bh-charcoal"]) expect(input).toHaveClass(c);
});

it("merges className onto the root", () => {
  render(<TextFieldSoft label="Email" className="mt-4" />);
  expect(screen.getByRole("textbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TextFieldSoft label="Email" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("textbox"))).toBe(true);
});
