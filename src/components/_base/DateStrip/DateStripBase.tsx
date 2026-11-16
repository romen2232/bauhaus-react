"use client";
import { DateFormatter, parseDate, type CalendarDate } from "@internationalized/date";
import { Radio, RadioGroup } from "react-aria-components";
import { cn } from "../../../lib/cn.js";

export type DateStripBaseClasses = { root: string; day: string; weekday: string; number: string };

export type DateStripBaseProps = {
  /** Accessible name of the radio group. */
  label: string;
  /** First day shown. */
  start: CalendarDate;
  /** Number of consecutive days shown. */
  days?: number;
  /** Controlled selection; `null` means nothing selected. */
  value?: CalendarDate | null;
  defaultValue?: CalendarDate;
  onChange?: (date: CalendarDate) => void;
  minValue?: CalendarDate;
  maxValue?: CalendarDate;
  /** BCP 47 locale for weekday names and accessible labels. */
  locale?: string;
  className?: string;
  /** Style selection with React Aria's `data-[selected]:` attribute in `day`. */
  classes: DateStripBaseClasses;
};

/**
 * Internal: single-select strip of consecutive days on React Aria's radio group
 * (arrow-key navigation). Each day shows a short weekday and day number; its
 * accessible name is the full date.
 */
export function DateStripBase({
  label,
  start,
  days = 7,
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  locale = "en-US",
  className,
  classes,
}: DateStripBaseProps) {
  // Format in UTC so the shown day never shifts with the viewer's time zone.
  const short = new DateFormatter(locale, { weekday: "short", timeZone: "UTC" });
  const full = new DateFormatter(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const dates = Array.from({ length: days }, (_, i) => start.add({ days: i }));
  const outOfRange = (date: CalendarDate) =>
    (minValue !== undefined && date.compare(minValue) < 0) || (maxValue !== undefined && date.compare(maxValue) > 0);

  return (
    <RadioGroup
      aria-label={label}
      orientation="horizontal"
      className={cn(classes.root, className)}
      value={value === undefined ? undefined : (value?.toString() ?? null)}
      defaultValue={defaultValue?.toString()}
      onChange={onChange ? (v) => onChange(parseDate(v)) : undefined}
    >
      {dates.map((date) => {
        const asDate = date.toDate("UTC");
        return (
          <Radio
            key={date.toString()}
            value={date.toString()}
            aria-label={full.format(asDate)}
            isDisabled={outOfRange(date)}
            className={classes.day}
          >
            <span className={classes.weekday}>{short.format(asDate)}</span>
            <span className={classes.number}>{date.day}</span>
          </Radio>
        );
      })}
    </RadioGroup>
  );
}
