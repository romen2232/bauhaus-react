import { CalendarDate } from "@internationalized/date";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { DateStripBase } from "./DateStripBase";

const d = { root: "r", day: "", weekday: "", number: "n" };

it("is a named radio group of seven days by default", () => {
  render(<DateStripBase classes={d} label="Pick a day" start={new CalendarDate(2026, 11, 16)} />);
  expect(screen.getByRole("radiogroup", { name: "Pick a day" })).toBeInTheDocument();
  expect(screen.getAllByRole("radio")).toHaveLength(7);
});

it("crosses a year boundary", async () => {
  const onChange = vi.fn();
  render(<DateStripBase classes={d} label="Pick a day" start={new CalendarDate(2026, 12, 29)} onChange={onChange} />);
  const numbers = screen.getAllByRole("radio").map((r) => r.closest("label")!.querySelector(".n")!.textContent);
  expect(numbers).toEqual(["29", "30", "31", "1", "2", "3", "4"]);
  await userEvent.click(screen.getByRole("radio", { name: "Thursday, December 31, 2026" }));
  expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2026, 12, 31));
  await userEvent.keyboard("{ArrowRight}");
  expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2027, 1, 1));
});

it("disables days outside the range", () => {
  render(
    <DateStripBase
      classes={d}
      label="Pick"
      start={new CalendarDate(2026, 11, 16)}
      minValue={new CalendarDate(2026, 11, 18)}
      maxValue={new CalendarDate(2026, 11, 20)}
    />,
  );
  expect(screen.getByRole("radio", { name: /November 16, 2026/ })).toBeDisabled();
  expect(screen.getByRole("radio", { name: /November 18, 2026/ })).toBeEnabled();
  expect(screen.getByRole("radio", { name: /November 21, 2026/ })).toBeDisabled();
});

it("uses the locale for weekday names", () => {
  render(<DateStripBase classes={d} label="Día" locale="es-ES" start={new CalendarDate(2026, 11, 16)} />);
  const monday = screen.getByRole("radio", { name: /lunes/ });
  expect(within(monday.closest("label")!).getByText(/lun/)).toBeInTheDocument();
});

it("is controllable and merges className onto the root", async () => {
  const onChange = vi.fn();
  render(
    <DateStripBase
      classes={d}
      label="Pick"
      start={new CalendarDate(2026, 11, 16)}
      value={new CalendarDate(2026, 11, 17)}
      onChange={onChange}
      className="x"
    />,
  );
  expect(screen.getByRole("radio", { name: /November 17, 2026/ })).toBeChecked();
  await userEvent.click(screen.getByRole("radio", { name: /November 19, 2026/ }));
  expect(onChange).toHaveBeenCalledWith(new CalendarDate(2026, 11, 19));
  expect(screen.getByRole("radio", { name: /November 17, 2026/ })).toBeChecked();
  expect(screen.getByRole("radiogroup")).toHaveClass("r", "x");
});
