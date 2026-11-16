import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { IconButtonSwiss } from "./IconButtonSwiss";

it("is named by aria-label and defaults to a circular outline", () => {
  render(<IconButtonSwiss aria-label="Add transfer">+</IconButtonSwiss>);
  expect(screen.getByRole("button", { name: "Add transfer" })).toHaveClass(
    "border-bh-ink",
    "bg-transparent",
    "rounded-full",
  );
});

it("solid variant has an ink fill", () => {
  render(
    <IconButtonSwiss aria-label="Next" variant="solid">
      →
    </IconButtonSwiss>,
  );
  expect(screen.getByRole("button")).toHaveClass("bg-bh-ink");
});

it("lg renders the FAB size", () => {
  render(
    <IconButtonSwiss aria-label="Add" size="lg">
      +
    </IconButtonSwiss>,
  );
  expect(screen.getByRole("button")).toHaveClass("size-14");
});

it("renders a link with href", () => {
  render(
    <IconButtonSwiss aria-label="Account" href="/account">
      A
    </IconButtonSwiss>,
  );
  expect(screen.getByRole("link", { name: "Account" })).toHaveAttribute("href", "/account");
});

it("forwards className and ref", () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <IconButtonSwiss aria-label="Add" className="ml-2" ref={ref}>
      +
    </IconButtonSwiss>,
  );
  expect(screen.getByRole("button")).toHaveClass("ml-2");
  expect(ref.current).toBeInstanceOf(HTMLButtonElement);
});
