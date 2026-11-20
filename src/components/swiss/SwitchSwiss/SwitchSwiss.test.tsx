import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { SwitchSwiss } from "./SwitchSwiss";

const track = (c: HTMLElement) => c.querySelector("[aria-hidden]")!;

it("is a named, required switch", () => {
  render(<SwitchSwiss label="Notifications" isRequired />);
  expect(screen.getByRole("switch", { name: /Notifications/ })).toBeRequired();
});

it("shows an invalid message in non-red text with a marker, and the track does not change", () => {
  const valid = render(<SwitchSwiss label="Terms" />);
  const validTrack = track(valid.container).className;
  valid.unmount();
  const { container } = render(<SwitchSwiss label="Terms" isInvalid errorMessage="Turn on to continue" />);
  const msg = screen.getByText("Turn on to continue");
  expect(msg.closest("[class]")!.className).not.toMatch(/text-bh-(red|accent)/);
  const marks = container.querySelectorAll("[aria-hidden]");
  expect(marks[0]!.className).toBe(validTrack);
  expect(marks[marks.length - 1]!).toHaveClass("bg-bh-accent");
});

it("has the look track: 1px ink border, square, ink when on, thumb moves without translate", () => {
  const { container } = render(<SwitchSwiss label="A" />);
  for (const c of ["border", "border-bh-ink", "bg-transparent", "data-[checked]:bg-bh-ink"]) {
    expect(track(container)).toHaveClass(c);
  }
  expect(track(container).className).not.toMatch(/rounded-(?!none)/);
  const thumb = track(container).firstElementChild!;
  expect(thumb.className).not.toMatch(/rounded|translate/);
  expect(thumb.className).toContain("data-[checked]:ml-auto");
});

it("has exactly one bh-accent token when invalid", () => {
  const { container } = render(<SwitchSwiss label="Terms" isInvalid errorMessage="Required" />);
  const count = [...container.querySelectorAll("*")]
    .flatMap((el) => (el.getAttribute("class") ?? "").split(/\s+/))
    .filter((c) => c.includes("bh-accent")).length;
  expect(count).toBe(1);
});

it("merges className onto the root", () => {
  render(<SwitchSwiss label="A" className="mt-4" />);
  expect(screen.getByRole("switch").closest(".mt-4")).not.toBeNull();
});

it("forwards ref to the root element", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SwitchSwiss label="A" ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current!.contains(screen.getByRole("switch"))).toBe(true);
});
