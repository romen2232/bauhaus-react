import { render, screen } from "@testing-library/react";
import { Timeline } from "./Timeline";

it("marks years as time elements in an ordered list", () => {
  render(<Timeline items={[{ year: "1919", content: "Founded" }, { year: "1925", content: "Moved" }]} />);
  const year = screen.getByText("1919");
  expect(year.tagName).toBe("TIME");
  expect(year).toHaveAttribute("datetime", "1919");
  expect(screen.getByRole("list").tagName).toBe("OL");
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});
