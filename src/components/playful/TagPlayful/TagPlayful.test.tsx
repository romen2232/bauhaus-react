import { render, screen } from "@testing-library/react";
import { TagPlayful } from "./TagPlayful";

it("defaults to a sharp yellow tag with ink text", () => {
  render(<TagPlayful>New script</TagPlayful>);
  expect(screen.getByText("New script")).toHaveClass("bg-bh-yellow", "text-bh-ink", "rounded-none", "uppercase");
});

it("uses the contrast-safe pair for its color", () => {
  render(<TagPlayful color="pink">Daily sketch</TagPlayful>);
  expect(screen.getByText("Daily sketch")).toHaveClass("bg-bh-pink", "text-bh-ink");
});

it("navy tag gets paper text", () => {
  render(<TagPlayful color="navy">WebGL toy</TagPlayful>);
  expect(screen.getByText("WebGL toy")).toHaveClass("text-bh-paper");
});
