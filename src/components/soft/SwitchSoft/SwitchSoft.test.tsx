import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SwitchSoft } from "./SwitchSoft";

const track = (c: HTMLElement) => c.querySelector("[aria-hidden]")!;

it("is a named, required switch", () => {
  render(<SwitchSoft label="Notifications" isRequired />);
  expect(screen.getByRole("switch", { name: /Notifications/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a dot marker, and the track does not change", () => {
  const valid = render(<SwitchSoft label="Terms" />);
  const validTrack = track(valid.container).className;
  valid.unmount();
  const { container } = render(<SwitchSoft label="Terms" isInvalid errorMessage="Turn on to continue" />);
  const msg = screen.getByText("Turn on to continue");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marks = container.querySelectorAll("[aria-hidden]");
  expect(marks[0]!.className).toBe(validTrack);
  expect(marks[marks.length - 1]!).toHaveClass("bg-bh-red", "rounded-full");
});

it("defaults to the neutral tone and honours tone", () => {
  const a = render(<SwitchSoft label="A" />);
  expect(track(a.container).className).toContain("data-[checked]:bg-bh-charcoal");
  a.unmount();
  const b = render(<SwitchSoft label="A" tone="blue" />);
  expect(track(b.container).className).toContain("data-[checked]:bg-bh-blue");
});

it("has the look track: 1px charcoal outline, sand when off, pill, no translate", () => {
  const { container } = render(<SwitchSoft label="A" />);
  for (const c of ["border", "border-bh-charcoal", "bg-bh-sand", "rounded-full"]) {
    expect(track(container)).toHaveClass(c);
  }
  expect(track(container).firstElementChild!.className).not.toContain("translate");
  expect(track(container).firstElementChild!).toHaveClass("bg-bh-charcoal", "border", "border-bh-charcoal");
});

it("merges className onto the root", () => {
  render(<SwitchSoft label="A" className="mt-4" />);
  expect(screen.getByRole("switch").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SwitchSoft label="A" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("switch"))).toBe(true);
});
