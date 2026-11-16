import { render, screen } from "@testing-library/react";
import { CardBase } from "./CardBase";

const classes = { root: "r", header: "h", body: "b", footer: "f" };

it("is an article without href", () => {
  render(
    <CardBase classes={classes} header={<h3>Read</h3>} footer="Foot">
      Body
    </CardBase>,
  );
  const article = screen.getByRole("article");
  expect(Array.from(article.children).map((c) => c.textContent)).toEqual(["Read", "Body", "Foot"]);
});

it("becomes one link with href", () => {
  render(
    <CardBase classes={classes} href="/x" header={<h3>Read</h3>}>
      Body
    </CardBase>,
  );
  const link = screen.getByRole("link");
  expect(link).toHaveAttribute("href", "/x");
  expect(link).toHaveTextContent("ReadBody");
  expect(screen.queryByRole("article")).toBeNull();
});

it("merges className after the root slot", () => {
  render(
    <CardBase classes={classes} className="x">
      Body
    </CardBase>,
  );
  expect(screen.getByRole("article")).toHaveClass("r", "x");
});
