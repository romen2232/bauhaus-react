import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { TextLinkPlayful } from "./TextLinkPlayful";

it("is a link named by its text, with a thick underline", () => {
  render(
    <TextLinkPlayful href="/courses" arrow="right">
      See the courses
    </TextLinkPlayful>,
  );
  const link = screen.getByRole("link", { name: "See the courses" });
  expect(link).toHaveClass("underline", "decoration-2", "underline-offset-4");
});

it("merges className and forwards ref", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <TextLinkPlayful href="/" className="x" ref={ref}>
      Go
    </TextLinkPlayful>,
  );
  expect(screen.getByRole("link")).toHaveClass("x");
  expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
});
