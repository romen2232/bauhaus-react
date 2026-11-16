import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { TabsSwiss } from "./TabsSwiss";

const items = [
  { id: "daily", title: "Daily", content: "Daily transactions" },
  { id: "monthly", title: "Monthly", content: "Monthly transactions" },
];

it("is a named tab list whose arrow keys move the selection", async () => {
  const onSelectionChange = vi.fn();
  render(<TabsSwiss label="Statement period" items={items} onSelectionChange={onSelectionChange} />);
  expect(screen.getByRole("tablist", { name: "Statement period" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("tab", { name: "Daily" }));
  await userEvent.keyboard("{ArrowRight}");
  expect(onSelectionChange).toHaveBeenLastCalledWith("monthly");
  expect(screen.getByRole("tabpanel")).toHaveTextContent("Monthly transactions");
});

it("uses hairlines and gives every tab a non-colour selected underline", () => {
  render(<TabsSwiss label="Statement period" items={items} />);
  expect(screen.getByRole("tablist")).toHaveClass("border-b", "border-bh-rule");
  for (const tab of screen.getAllByRole("tab")) {
    expect(tab).toHaveClass("data-[selected]:border-bh-ink", "data-[selected]:text-bh-ink");
  }
});

it("merges className onto the root", () => {
  render(<TabsSwiss label="Statement period" items={items} className="mt-6" />);
  expect(screen.getByRole("tablist").parentElement).toHaveClass("mt-6");
});

it("forwards ref to the root", () => {
  const ref = createRef<HTMLDivElement>();
  render(<TabsSwiss label="Statement period" items={items} ref={ref} />);
  expect(ref.current).toBe(screen.getByRole("tablist").parentElement);
});
