import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { IconButtonPlayful } from "./IconButtonPlayful";

it("renders a link named by aria-label when given href", () => {
  render(
    <IconButtonPlayful aria-label="Next" href="/n">
      →
    </IconButtonPlayful>,
  );
  expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/n");
});

it("lg is the FAB size", () => {
  render(
    <IconButtonPlayful aria-label="Add" size="lg">
      +
    </IconButtonPlayful>,
  );
  expect(screen.getByRole("button", { name: "Add" })).toHaveClass("size-14");
});

it("forwards ref", () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <IconButtonPlayful aria-label="Go" ref={ref}>
      →
    </IconButtonPlayful>,
  );
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
