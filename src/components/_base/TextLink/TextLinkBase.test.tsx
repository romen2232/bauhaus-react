import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextLinkBase } from "./TextLinkBase";

const classes = { root: "r", arrow: "a" };

it("the accessible name excludes the decorative arrow", () => {
  render(
    <TextLinkBase classes={classes} href="/courses" arrow="right">
      See the courses
    </TextLinkBase>,
  );
  const link = screen.getByRole("link", { name: "See the courses" });
  expect(link).toHaveAttribute("href", "/courses");
  expect(screen.getByText("→")).toHaveAttribute("aria-hidden", "true");
});

it.each([
  ["up-right", "↗"],
  ["down", "↓"],
] as const)("arrow %s renders %s", (arrow, glyph) => {
  render(
    <TextLinkBase classes={classes} href="/" arrow={arrow}>
      Go
    </TextLinkBase>,
  );
  expect(screen.getByText(glyph)).toHaveClass("a");
});

it("has no arrow by default, merges className and forwards ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <TextLinkBase classes={classes} href="/" className="x" ref={ref}>
      Go
    </TextLinkBase>,
  );
  expect(screen.getByRole("link")).toHaveTextContent(/^Go$/);
  expect(screen.getByRole("link")).toHaveClass("r", "x");
  expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
});
