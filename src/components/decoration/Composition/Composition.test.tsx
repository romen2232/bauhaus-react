import { render } from "@testing-library/react";
import { Composition } from "./Composition";

it("is decorative and places one child per cell, in order", () => {
  const { container } = render(
    <Composition
      cols={3}
      rows={2}
      cells={[
        { col: 1, row: 1, colSpan: 2, node: <i>a</i> },
        { col: 3, row: 2, node: <i>b</i> },
      ]}
    />,
  );
  const root = container.firstElementChild!;
  expect(root).toHaveAttribute("aria-hidden", "true");
  expect(root).toHaveClass("grid-cols-3", "grid-rows-2");
  expect(root.children).toHaveLength(2);
  expect(root.children[0]).toHaveClass("col-start-1", "row-start-1", "col-span-2");
  expect(root.children[1]).toHaveClass("col-start-3", "row-start-2", "col-span-1", "row-span-1");
  expect(root.textContent).toBe("ab");
});
