import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ProjectCardSoft } from "./ProjectCardSoft";

it("is one link named by its title", () => {
  render(<ProjectCardSoft href="/a" initial="A" title="Room A" />);
  expect(screen.getByRole("link", { name: "Room A" })).toHaveClass("rounded-bh-soft");
});

it("renders the initial in a tone header block", () => {
  render(<ProjectCardSoft href="/a" initial="A" title="Room A" tone="yellow" />);
  expect(screen.getByText("A")).toHaveClass("bg-bh-yellow", "text-bh-ink");
});

it("defaults the header block to blue", () => {
  render(<ProjectCardSoft href="/a" initial="A" title="Room A" />);
  expect(screen.getByText("A")).toHaveClass("bg-bh-blue");
});

it("renders a tag from its label", () => {
  render(<ProjectCardSoft href="/a" initial="A" title="Room A" tag={{ label: "Free" }} />);
  expect(screen.getByText("Free")).toHaveClass("rounded-full");
});

it("shows media in black and white", () => {
  render(<ProjectCardSoft href="/a" initial="A" title="Room A" media={<img alt="" src="/a.jpg" />} />);
  expect(document.querySelector("img")!.parentElement).toHaveClass("grayscale");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(<ProjectCardSoft href="/a" initial="A" title="Room A" className="w-80" ref={ref} />);
  expect(screen.getByRole("link")).toHaveClass("w-80");
  expect(ref.current).toBe(screen.getByRole("link"));
});
