import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { CardPlayful } from "./CardPlayful";

it("is a sharp article with an ink border and hard shadow", () => {
  render(<CardPlayful header={<h3>Lorem</h3>}>Ipsum</CardPlayful>);
  expect(screen.getByRole("article")).toHaveClass("rounded-none", "border-2", "border-bh-ink", "shadow-bh-hard");
});

it("becomes a link with href, merges className and forwards ref", () => {
  const ref = createRef<HTMLElement>();
  render(
    <CardPlayful href="/x" className="x" ref={ref}>
      Ipsum
    </CardPlayful>,
  );
  expect(screen.getByRole("link")).toHaveClass("x");
  expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
});
