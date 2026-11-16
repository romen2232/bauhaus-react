import { render, screen } from "@testing-library/react";
import { TopBarPlayful } from "./TopBarPlayful";

it("renders a banner with brand, meta cells and a trailing action", () => {
  render(
    <TopBarPlayful
      brand={<a href="/">mijonju</a>}
      meta={["Public notebook", "Version 0.71"]}
      action={<button type="button">Menu</button>}
    />,
  );
  const banner = screen.getByRole("banner");
  expect(banner).toHaveClass("border-b", "border-bh-ink", "divide-x", "divide-bh-ink");
  expect(screen.getByRole("link", { name: "mijonju" })).toBeInTheDocument();
  expect(screen.getByText("Public notebook")).toBeInTheDocument();
  expect(screen.getByText("Version 0.71")).toBeInTheDocument();
  const cells = banner.children;
  expect(cells[cells.length - 1]).toContainElement(screen.getByRole("button", { name: "Menu" }));
  expect(cells[cells.length - 1]).toHaveClass("ml-auto");
});

it("hides meta cells on small screens", () => {
  render(<TopBarPlayful brand="b" meta={["Meta"]} />);
  expect(screen.getByText("Meta")).toHaveClass("hidden", "md:block");
});

it("renders without meta or action", () => {
  render(<TopBarPlayful brand="Only brand" />);
  expect(screen.getByRole("banner").children).toHaveLength(1);
});
