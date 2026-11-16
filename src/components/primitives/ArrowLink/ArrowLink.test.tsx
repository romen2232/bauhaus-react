import { render, screen } from "@testing-library/react";
import { ArrowLink } from "./ArrowLink";

it("is a link named by its text only, not the arrow", () => {
  render(<ArrowLink href="/manifesto">Manifesto</ArrowLink>);
  expect(screen.getByRole("link", { name: "Manifesto" })).toHaveAttribute("href", "/manifesto");
});

it("renders a right arrow by default, hidden from assistive tech", () => {
  render(<ArrowLink href="#">Next</ArrowLink>);
  const arrow = screen.getByText("→");
  expect(arrow).toHaveAttribute("aria-hidden", "true");
});

it("renders a north-east arrow for up-right", () => {
  render(<ArrowLink href="#" direction="up-right">Manifesto</ArrowLink>);
  expect(screen.getByText("↗")).toBeInTheDocument();
});

it("maps hero size to responsive display classes", () => {
  render(<ArrowLink href="#" size="hero">Manifesto</ArrowLink>);
  expect(screen.getByRole("link")).toHaveClass("text-6xl", "md:text-8xl");
});

it("arrow motion only animates when the user allows motion", () => {
  render(<ArrowLink href="#">Go</ArrowLink>);
  const classes = Array.from(screen.getByText("→").classList);
  expect(classes.filter((c) => c.startsWith("transition") || c.startsWith("group-hover:"))).toEqual([]);
});
