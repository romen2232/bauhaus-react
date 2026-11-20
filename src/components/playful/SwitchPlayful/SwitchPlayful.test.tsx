import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SwitchPlayful } from "./SwitchPlayful";

const track = (c: HTMLElement) => c.querySelector("[aria-hidden]")!;

it("is a named, required switch", () => {
  render(<SwitchPlayful label="Notifications" isRequired />);
  expect(screen.getByRole("switch", { name: /Notifications/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker, and the track does not change", () => {
  const valid = render(<SwitchPlayful label="Terms" />);
  const validTrack = track(valid.container).className;
  valid.unmount();
  const { container } = render(<SwitchPlayful label="Terms" isInvalid errorMessage="Turn on to continue" />);
  const msg = screen.getByText("Turn on to continue");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marks = container.querySelectorAll("[aria-hidden]");
  expect(marks[0]!.className).toBe(validTrack);
  expect(marks[marks.length - 1]!).toHaveClass("bg-bh-red");
});

it("defaults to an ink fill and honours color", () => {
  const a = render(<SwitchPlayful label="A" />);
  expect(track(a.container).className).toContain("data-[checked]:bg-bh-ink");
  a.unmount();
  const b = render(<SwitchPlayful label="A" color="red" />);
  expect(track(b.container).className).toContain("data-[checked]:bg-bh-red");
});

it("has the look track: 2px ink border, pill, thumb that translates", () => {
  const { container } = render(<SwitchPlayful label="A" />);
  for (const c of ["border-2", "border-bh-ink", "rounded-full", "bg-bh-paper-white"]) {
    expect(track(container)).toHaveClass(c);
  }
  expect(track(container).firstElementChild!.className).toContain("data-[checked]:translate-x-6");
});

it("merges className onto the root", () => {
  render(<SwitchPlayful label="A" className="mt-4" />);
  expect(screen.getByRole("switch").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SwitchPlayful label="A" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("switch"))).toBe(true);
});
