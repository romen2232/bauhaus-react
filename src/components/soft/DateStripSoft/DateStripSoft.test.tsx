import { CalendarDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { DateStripSoft } from "./DateStripSoft";

const start = new CalendarDate(2026, 11, 16);

it("is a named radio group that reports the clicked day", async () => {
  const onChange = vi.fn();
  render(<DateStripSoft label="Pick a day" start={start} onChange={onChange} />);
  expect(screen.getByRole("radiogroup", { name: "Pick a day" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: /November 18, 2026/ }));
  expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2026, 11, 18));
  expect(screen.getByRole("radio", { name: /November 18, 2026/ })).toBeChecked();
});

it("disables days before minValue", () => {
  render(<DateStripSoft label="Pick" start={start} minValue={new CalendarDate(2026, 11, 18)} />);
  expect(screen.getByRole("radio", { name: /November 17, 2026/ })).toBeDisabled();
});

it("selected day is a rounded charcoal tile with a light hero numeral", () => {
  render(<DateStripSoft label="Pick" start={start} />);
  const tile = screen.getByRole("radio", { name: /November 16, 2026/ }).closest("label")!;
  expect(tile).toHaveClass("rounded-bh-soft", "data-[selected]:bg-bh-charcoal");
  expect(screen.getByText("16")).toHaveClass("font-light");
});

it("merges className onto the root", () => {
  render(<DateStripSoft label="Pick" start={start} className="mt-2" />);
  expect(screen.getByRole("radiogroup")).toHaveClass("mt-2");
});

it("pads the scroll root so the 4px focus ring on a day is not clipped", () => {
  render(<DateStripSoft label="Pick" start={start} />);
  expect(screen.getByRole("radiogroup")).toHaveClass("p-1.5");
});
