import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ButtonPlayful } from "./ButtonPlayful";

it("renders a type=button pill by default", () => {
  render(<ButtonPlayful>Primary action</ButtonPlayful>);
  const btn = screen.getByRole("button", { name: "Primary action" });
  expect(btn).toHaveAttribute("type", "button");
  expect(btn).toHaveClass("rounded-full", "bg-bh-ink", "text-bh-paper");
});

it("keeps an explicit submit type", () => {
  render(<ButtonPlayful type="submit">Send</ButtonPlayful>);
  expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
});

it("renders a link when href is given", () => {
  render(<ButtonPlayful href="/learn-more">Learn more</ButtonPlayful>);
  expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute("href", "/learn-more");
});

it("a disabled link is not navigable or clickable", async () => {
  const onClick = vi.fn();
  render(
    <ButtonPlayful href="/learn-more" disabled onClick={onClick}>
      Closed
    </ButtonPlayful>,
  );
  const link = screen.getByText("Closed").closest("a")!;
  expect(link).not.toHaveAttribute("href");
  expect(link).toHaveAttribute("aria-disabled", "true");
  expect(link).toHaveAttribute("tabindex", "-1");
  await userEvent.click(link);
  expect(onClick).not.toHaveBeenCalled();
});

it("a disabled button is disabled", () => {
  render(<ButtonPlayful disabled>Nope</ButtonPlayful>);
  expect(screen.getByRole("button")).toBeDisabled();
});

it("outline variant has an ink border and transparent fill", () => {
  render(<ButtonPlayful variant="outline">Secondary action</ButtonPlayful>);
  expect(screen.getByRole("button")).toHaveClass("border-2", "border-bh-ink", "bg-transparent", "rounded-full");
});

it("color variant uses the contrast-safe fill pair", () => {
  render(<ButtonPlayful variant="color" color="blue">Go</ButtonPlayful>);
  expect(screen.getByRole("button")).toHaveClass("bg-bh-blue", "text-bh-paper");
});

it("maps size to height classes", () => {
  render(<ButtonPlayful size="lg">Big</ButtonPlayful>);
  expect(screen.getByRole("button")).toHaveClass("h-14");
});

it("className overrides the variant background", () => {
  render(<ButtonPlayful className="bg-bh-red">Red</ButtonPlayful>);
  const btn = screen.getByRole("button");
  expect(btn).toHaveClass("bg-bh-red");
  expect(btn).not.toHaveClass("bg-bh-ink");
});

it("a disabled link keeps its link role so it is announced as a disabled link", () => {
  render(<ButtonPlayful href="/x" disabled>Closed</ButtonPlayful>);
  expect(screen.getByRole("link", { name: "Closed" })).toHaveAttribute("aria-disabled", "true");
});

it("hover motion only animates when the user allows motion", () => {
  render(<ButtonPlayful>Go</ButtonPlayful>);
  const classes = Array.from(screen.getByRole("button").classList);
  expect(classes.filter((c) => c.startsWith("transition") || c.startsWith("duration"))).toEqual([]);
  expect(classes.some((c) => c.startsWith("motion-safe:transition"))).toBe(true);
});

it("pressing cancels the hover lift: it drops flat and loses its shadow", () => {
  render(<ButtonPlayful>Press</ButtonPlayful>);
  const btn = screen.getByRole("button");
  expect(btn).toHaveClass("active:shadow-none", "motion-safe:active:translate-x-0", "motion-safe:active:translate-y-0");
});

it("a disabled button has no press effect", () => {
  render(<ButtonPlayful disabled>Press</ButtonPlayful>);
  expect(btn(screen.getByRole("button"))).not.toContain("active:shadow-none");
});

const btn = (el: HTMLElement) => Array.from(el.classList);
