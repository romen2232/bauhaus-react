import { render, screen } from "@testing-library/react";
import { IconButtonBase } from "./IconButtonBase";

const classes = { root: "r" };

it("is a button named by aria-label", () => {
  render(
    <IconButtonBase classes={classes} aria-label="Next">
      →
    </IconButtonBase>,
  );
  expect(screen.getByRole("button", { name: "Next" })).toHaveClass("r");
});

it("is a link named by aria-label when given href", () => {
  render(
    <IconButtonBase classes={classes} aria-label="Open" href="/x">
      ↗
    </IconButtonBase>,
  );
  expect(screen.getByRole("link", { name: "Open" })).toHaveAttribute("href", "/x");
});

it("requires aria-label at the type level", () => {
  // @ts-expect-error aria-label is required
  const el = <IconButtonBase classes={classes}>→</IconButtonBase>;
  expect(el).toBeTruthy();
});
