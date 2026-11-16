import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { ProjectCardSwiss } from "./ProjectCardSwiss";

it("is one unfilled link named by its title", () => {
  render(<ProjectCardSwiss href="/a" initial="A" title="Account A" />);
  const link = screen.getByRole("link", { name: "Account A" });
  expect(link).toHaveClass("group", "border-bh-rule", "bg-transparent");
  expect(link.className).not.toMatch(/(^| )bg-bh-/);
});

it("uses a decorative initial whose emphasis changes on hover", () => {
  render(<ProjectCardSwiss href="/a" initial="A" title="Account A" />);
  const initial = screen.getByText("A");
  expect(initial).toHaveAttribute("aria-hidden", "true");
  expect(initial).toHaveClass("text-bh-muted-text", "group-hover:text-bh-ink");
});

it("renders a Swiss tag from its label", () => {
  render(<ProjectCardSwiss href="/a" initial="A" title="Account A" tag={{ label: "New" }} />);
  expect(screen.getByText("New")).toHaveClass("border-bh-ink", "self-start");
});

it("includes visible tag and description in the link's accessible name", () => {
  render(
    <ProjectCardSwiss
      href="/a"
      initial="A"
      title="Account A"
      description="Long-term savings"
      tag={{ label: "New" }}
    />,
  );
  expect(screen.getByRole("link", { name: "New Account A Long-term savings" })).toBeInTheDocument();
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(<ProjectCardSwiss href="/a" initial="A" title="Account A" className="w-80" ref={ref} />);
  expect(screen.getByRole("link")).toHaveClass("w-80");
  expect(ref.current).toBe(screen.getByRole("link"));
});
