import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextFieldSwiss } from "./TextFieldSwiss";

it("is a named, required textbox", () => {
  render(<TextFieldSwiss label="Email" isRequired />);
  expect(screen.getByRole("textbox", { name: /Email/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker", () => {
  const { container } = render(<TextFieldSwiss label="Email" isInvalid errorMessage="Enter a valid email" />);
  const msg = screen.getByText("Enter a valid email");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marker = container.querySelector("[aria-hidden]");
  expect(marker).toBeNull();
  expect(screen.getByRole("textbox")).toHaveClass("data-[invalid]:border-bh-accent");
});

it("has the look's field surface", () => {
  render(<TextFieldSwiss label="Email" />);
  const input = screen.getByRole("textbox");
  for (const c of ["border-b", "border-bh-ink", "bg-transparent"]) expect(input).toHaveClass(c);
  expect(input.className).not.toMatch(/border-2|rounded-(?!none)/);
});

it("merges className onto the root", () => {
  render(<TextFieldSwiss label="Email" className="mt-4" />);
  expect(screen.getByRole("textbox").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TextFieldSwiss label="Email" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("textbox"))).toBe(true);
});
