import { render, screen } from "@testing-library/react";
import { TopBarPlayful } from "./TopBarPlayful";

it("renders a banner with brand, meta cells and a trailing action", () => {
  render(
    <TopBarPlayful
      brand={<a href="/">Brand</a>}
      meta={["Lorem ipsum", "Version 1.0"]}
      action={<button type="button">Menu</button>}
    />,
  );
  const banner = screen.getByRole("banner");
  expect(banner).toHaveClass("border-b", "border-bh-ink", "divide-x", "divide-bh-ink");
  expect(screen.getByRole("link", { name: "Brand" })).toBeInTheDocument();
  expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
  expect(screen.getByText("Version 1.0")).toBeInTheDocument();
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
