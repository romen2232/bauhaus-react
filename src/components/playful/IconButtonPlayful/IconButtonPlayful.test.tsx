import { render, screen } from "@testing-library/react";
import { IconButtonPlayful } from "./IconButtonPlayful";

it("is a round button named by aria-label", () => {
  render(<IconButtonPlayful aria-label="Next">→</IconButtonPlayful>);
  const btn = screen.getByRole("button", { name: "Next" });
  expect(btn).toHaveClass("rounded-full", "size-11");
  expect(btn).toHaveAttribute("type", "button");
});

it("outline variant has an ink border", () => {
  render(<IconButtonPlayful aria-label="Prev" variant="outline">←</IconButtonPlayful>);
  expect(screen.getByRole("button")).toHaveClass("border-2", "border-bh-ink");
});

it("requires aria-label at the type level", () => {
  // @ts-expect-error aria-label is required
  const el = <IconButtonPlayful>→</IconButtonPlayful>;
  expect(el).toBeTruthy();
});
