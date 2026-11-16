import { render, screen } from "@testing-library/react";
import { TagPlayful } from "./TagPlayful";

it("defaults to a sharp yellow tag with ink text", () => {
  render(<TagPlayful>Label one</TagPlayful>);
  expect(screen.getByText("Label one")).toHaveClass("bg-bh-yellow", "text-bh-ink", "rounded-none", "uppercase");
});

it("uses the contrast-safe pair for its color", () => {
  render(<TagPlayful color="pink">Label two</TagPlayful>);
  expect(screen.getByText("Label two")).toHaveClass("bg-bh-pink", "text-bh-ink");
});

it("navy tag gets paper text", () => {
  render(<TagPlayful color="navy">Label three</TagPlayful>);
  expect(screen.getByText("Label three")).toHaveClass("text-bh-paper");
});
