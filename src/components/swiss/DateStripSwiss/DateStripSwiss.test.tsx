import { createRef } from "react";
import { CalendarDate } from "@internationalized/date";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { DateStripSwiss } from "./DateStripSwiss";

const start = new CalendarDate(2026, 11, 16);

it("is a named radio group that reports and selects the clicked day", async () => {
  const onChange = vi.fn();
  render(<DateStripSwiss label="Payment date" start={start} onChange={onChange} />);
  expect(screen.getByRole("radiogroup", { name: "Payment date" })).toBeInTheDocument();
  await userEvent.click(screen.getByRole("radio", { name: /November 18, 2026/ }));
  expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2026, 11, 18));
  expect(screen.getByRole("radio", { name: /November 18, 2026/ })).toBeChecked();
});

it("disables days before minValue", () => {
  render(<DateStripSwiss label="Payment date" start={start} minValue={new CalendarDate(2026, 11, 18)} />);
  expect(screen.getByRole("radio", { name: /November 17, 2026/ })).toBeDisabled();
});

it("gives every day a non-colour selected underline", () => {
  render(<DateStripSwiss label="Payment date" start={start} />);
  for (const radio of screen.getAllByRole("radio")) {
    expect(radio.closest("label")).toHaveClass("data-[selected]:border-bh-ink");
  }
});

it("pads the horizontal scroll root so focus rings stay visible", () => {
  render(<DateStripSwiss label="Payment date" start={start} />);
  expect(screen.getByRole("radiogroup")).toHaveClass("overflow-x-auto", "p-1.5");
});

it("merges className onto the root", () => {
  render(<DateStripSwiss label="Payment date" start={start} className="mt-2" />);
  expect(screen.getByRole("radiogroup")).toHaveClass("mt-2");
});

it("forwards ref to the root", () => {
  const ref = createRef<HTMLDivElement>();
  render(<DateStripSwiss label="Payment date" start={start} ref={ref} />);
  expect(ref.current).toBe(screen.getByRole("radiogroup"));
});
