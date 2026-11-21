import { CalendarDate } from "@internationalized/date";
import { BarChartSoft, BottomNavSoft, CardSoft, DateStripSoft, DonutChartSoft, SwitchSoft } from "bauhaus-react";

const WEEK = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 26 },
  { label: "Fri", value: 22 },
];
const SOURCES = [
  { label: "Direct", value: 48 },
  { label: "Search", value: 32 },
  { label: "Social", value: 20 },
];

/** A product dashboard, built only from Soft components. 20px corners, in its own container. */
export function SoftBand({ large }: { large: boolean }) {
  return (
    <section
      aria-label="Soft"
      data-size={large ? "large" : "normal"}
      className={`mx-4 my-6 rounded-bh-soft bg-bh-sand md:mx-8 ${large ? "p-10 md:p-16" : "p-6 md:p-10"}`}
    >
      <div className="grid gap-6 md:grid-cols-3">
        <CardSoft header="Activity" className="md:col-span-2">
          <BarChartSoft title="Sessions this week" data={WEEK} height={180} />
        </CardSoft>
        <CardSoft header="Sources">
          <DonutChartSoft title="Traffic sources" data={SOURCES} />
        </CardSoft>
        <CardSoft header="Schedule" className="md:col-span-2">
          <DateStripSoft label="Pick a day" start={new CalendarDate(2026, 11, 16)} days={7} defaultValue={new CalendarDate(2026, 11, 18)} />
        </CardSoft>
        <CardSoft header="Settings">
          <SwitchSoft label="Weekly digest" defaultSelected />
        </CardSoft>
      </div>
      <BottomNavSoft
        label="App sections"
        showLabels
        className="mt-6"
        items={[
          { href: "#", label: "Home", icon: "●", current: true },
          { href: "#", label: "Stats", icon: "■" },
          { href: "#", label: "Plan", icon: "▲" },
        ]}
      />
    </section>
  );
}
