import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { Wordmark } from "./Wordmark";

it("renders a heading with no client code", () => {
  render(<Wordmark>Lorem ipsum</Wordmark>);
  expect(screen.getByRole("heading", { level: 1, name: "Lorem ipsum" })).toBeInTheDocument();
  const src = readFileSync(resolve(import.meta.dirname, "Wordmark.tsx"), "utf8");
  expect(src).not.toMatch(/use client|useEffect|useState/);
});

it("can render as a paragraph", () => {
  render(<Wordmark as="p">Lorem</Wordmark>);
  expect(screen.queryByRole("heading")).toBeNull();
  expect(screen.getByText("Lorem").tagName).toBe("P");
});

it("only sticks to the top when the shrink animation can run", () => {
  // Without the animation (reduced motion / no scroll timelines) it must scroll away, not cover the page.
  render(<Wordmark>Lorem</Wordmark>);
  const classes = screen.getByRole("heading").className.split(" ");
  const pinning = classes.filter((c) => /(^|:)(sticky|top-0)$/.test(c));
  expect(pinning.length).toBe(2);
  for (const c of pinning) expect(c.startsWith("motion-safe:supports-[animation-timeline:scroll()]:")).toBe(true);
});

it("only animates behind motion-safe and scroll-timeline support", () => {
  render(<Wordmark>Lorem</Wordmark>);
  const classes = screen.getByRole("heading").className.split(" ");
  const animated = classes.filter((c) => c.includes("animation"));
  expect(animated.length).toBeGreaterThan(0);
  for (const c of animated) expect(c.startsWith("motion-safe:supports-[animation-timeline:scroll()]:")).toBe(true);
});
