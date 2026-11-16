import { render, screen } from "@testing-library/react";
import { StatColumns } from "./StatColumns";

it("renders one column per item with its list", () => {
  render(
    <StatColumns
      items={[
        { label: "A", value: "24H", title: "Express", list: ["x", "y"] },
        { label: "B", value: "2 DAYS" },
      ]}
    />,
  );
  expect(screen.getByText("24H")).toBeInTheDocument();
  expect(screen.getByText("2 DAYS")).toBeInTheDocument();
  expect(screen.getByText("Express")).toBeInTheDocument();
  expect(screen.getAllByRole("listitem")).toHaveLength(2);
});

it("merges className onto the root", () => {
  const { container } = render(<StatColumns className="x" items={[{ label: "A", value: "1" }]} />);
  expect(container.firstElementChild).toHaveClass("x");
});
