import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ButtonBase } from "./ButtonBase";

const classes = { root: "r" };

it("renders a type=button by default", () => {
  render(<ButtonBase classes={classes}>Go</ButtonBase>);
  expect(screen.getByRole("button", { name: "Go" })).toHaveAttribute("type", "button");
});

it("keeps an explicit submit type", () => {
  render(
    <ButtonBase classes={classes} type="submit">
      Send
    </ButtonBase>,
  );
  expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
});

it("renders a link when href is given", () => {
  render(
    <ButtonBase classes={classes} href="/more">
      More
    </ButtonBase>,
  );
  expect(screen.getByRole("link", { name: "More" })).toHaveAttribute("href", "/more");
});

it("a disabled link is not navigable or clickable", async () => {
  const onClick = vi.fn();
  render(
    <ButtonBase classes={classes} href="/more" disabled onClick={onClick}>
      Closed
    </ButtonBase>,
  );
  const link = screen.getByText("Closed").closest("a")!;
  expect(link).not.toHaveAttribute("href");
  expect(link).toHaveAttribute("aria-disabled", "true");
  expect(link).toHaveAttribute("role", "link");
  expect(link).toHaveAttribute("tabindex", "-1");
  await userEvent.click(link);
  expect(onClick).not.toHaveBeenCalled();
});

it("a disabled button is disabled", () => {
  render(
    <ButtonBase classes={classes} disabled>
      Nope
    </ButtonBase>,
  );
  expect(screen.getByRole("button")).toBeDisabled();
});

it("merges className after the root slot", () => {
  render(
    <ButtonBase classes={classes} className="x">
      Go
    </ButtonBase>,
  );
  expect(screen.getByRole("button")).toHaveClass("r", "x");
});

it("forwards ref to the button or the anchor", () => {
  const b = createRef<HTMLButtonElement>();
  render(
    <ButtonBase classes={classes} ref={b}>
      Go
    </ButtonBase>,
  );
  expect(b.current).toBeInstanceOf(HTMLButtonElement);
  const a = createRef<HTMLAnchorElement>();
  render(
    <ButtonBase classes={classes} href="/x" ref={a}>
      Link
    </ButtonBase>,
  );
  expect(a.current).toBeInstanceOf(HTMLAnchorElement);
});
