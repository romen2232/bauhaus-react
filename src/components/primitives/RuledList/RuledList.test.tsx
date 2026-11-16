import { render, screen } from "@testing-library/react";
import { RuledList } from "./RuledList";

it("renders items as list items", () => {
  render(<RuledList items={[{ content: "Pure" }, { content: "Innovative", offset: 2 }]} />);
  expect(screen.getByRole("list")).toBeInTheDocument();
  expect(screen.getAllByRole("listitem").map((li) => li.textContent)).toEqual(["Pure", "Innovative"]);
});
