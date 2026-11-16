import { CalendarDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import { DateStripPlayful } from "./DateStripPlayful";

it("is a named radio group of sharp tiles", () => {
  render(<DateStripPlayful label="Pick a day" start={new CalendarDate(2026, 11, 16)} className="x" />);
  const group = screen.getByRole("radiogroup", { name: "Pick a day" });
  expect(group).toHaveClass("x");
  expect(screen.getAllByRole("radio")[0]!.closest("label")).toHaveClass("rounded-none", "data-[selected]:bg-bh-yellow");
});
