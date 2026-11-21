import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonSoft } from "./ButtonSoft/ButtonSoft";
import { IconButtonSoft } from "./IconButtonSoft/IconButtonSoft";
import { TextLinkSoft } from "./TextLinkSoft/TextLinkSoft";
import { TagSoft } from "./TagSoft/TagSoft";
import { ChipSoft } from "./ChipSoft/ChipSoft";
import { ProjectCardSoft } from "./ProjectCardSoft/ProjectCardSoft";
import { CardSoft } from "./CardSoft/CardSoft";
import { StackCardSoft } from "./StackCardSoft/StackCardSoft";
import { TopBarSoft } from "./TopBarSoft/TopBarSoft";
import { FooterSoft } from "./FooterSoft/FooterSoft";
import { BottomNavSoft } from "./BottomNavSoft/BottomNavSoft";
import { TabsSoft } from "./TabsSoft/TabsSoft";
import { MenuOverlaySoft } from "./MenuOverlaySoft/MenuOverlaySoft";
import { CarouselSoft } from "./CarouselSoft/CarouselSoft";
import { DateStripSoft } from "./DateStripSoft/DateStripSoft";
import { AudioPlayerSoft } from "./AudioPlayerSoft/AudioPlayerSoft";
import { TextFieldSoft } from "./TextFieldSoft/TextFieldSoft";
import { TextAreaSoft } from "./TextAreaSoft/TextAreaSoft";
import { SelectSoft } from "./SelectSoft/SelectSoft";
import { CheckboxSoft } from "./CheckboxSoft/CheckboxSoft";
import { RadioGroupSoft } from "./RadioGroupSoft/RadioGroupSoft";
import { SwitchSoft } from "./SwitchSoft/SwitchSoft";
import { TableSoft } from "./TableSoft/TableSoft";
import type { TableColumn } from "../_base/Table/tableTypes";
import { BarChartSoft } from "./BarChartSoft/BarChartSoft";
import { LineChartSoft } from "./LineChartSoft/LineChartSoft";
import { DonutChartSoft } from "./DonutChartSoft/DonutChartSoft";
import { SparklineSoft } from "./SparklineSoft/SparklineSoft";
import { BigNumber } from "../primitives/BigNumber/BigNumber";

const meta: Meta = { title: "Soft/Overview", parameters: { backgrounds: { default: "paper" } } };
export default meta;

// Soft separates by space and tonal fills, never by rules.
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">
    <h2 className="font-bh-display text-2xl font-light">{title}</h2>
    {children}
  </section>
);

type Project = { id: string; name: string; status: "live" | "draft"; users: number | null; shipped: Date };

const projects: Project[] = [
  { id: "aurora", name: "Aurora", status: "live", users: 1240, shipped: new Date("2026-01-12") },
  { id: "borealis", name: "Borealis", status: "draft", users: 86, shipped: new Date("2026-03-04") },
  { id: "cirrus", name: "Cirrus", status: "live", users: null, shipped: new Date("2026-05-21") },
  { id: "delta", name: "Delta", status: "draft", users: 412, shipped: new Date("2026-02-02") },
];

const statusRank = (row: Project) => (row.status === "live" ? 2 : 1);

const projectColumns = (status: (row: Project) => React.ReactNode): TableColumn<Project>[] => [
  { id: "name", label: "Name", isRowHeader: true, allowsSorting: true },
  { id: "status", label: "Status", allowsSorting: true, sortValue: statusRank, render: status },
  { id: "users", label: "Users", align: "end", allowsSorting: true },
  { id: "shipped", label: "Shipped", allowsSorting: true },
];

const chartMonths = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
  { label: "Mar", value: 25 },
  { label: "Apr", value: 31 },
];
const chartSeries = [
  { id: "visits", label: "Visits", data: chartMonths },
  { id: "signups", label: "Signups", data: chartMonths.map((d) => ({ ...d, value: Math.round(d.value / 2) })) },
];
const chartSpend = [
  { label: "Rent", value: 40 },
  { label: "Food", value: 30 },
  { label: "Fun", value: 30 },
];
const chartTrend = [4, 7, 5, 9, 8, 12, 11].map((value, i) => ({ label: `Day ${i + 1}`, value }));

/** Every Soft component on the Soft ground. */
export const AllComponents: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 bg-bh-paper p-8 text-bh-ink">
      <TopBarSoft
        brand="Lorem"
        meta={["Ipsum", "v0.3"]}
        action={
          <MenuOverlaySoft
            triggerLabel="Menu"
            title="Site menu"
            links={[
              { href: "#a", label: "Lorem", current: true },
              { href: "#b", label: "Ipsum" },
            ]}
          />
        }
      />
      <Section title="Actions">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonSoft>Solid</ButtonSoft>
          <ButtonSoft variant="outline">Outline</ButtonSoft>
          <ButtonSoft variant="color" tone="red">Red</ButtonSoft>
          <ButtonSoft variant="color" tone="yellow">Yellow</ButtonSoft>
          <ButtonSoft variant="color">Blue</ButtonSoft>
          <IconButtonSoft aria-label="Next">→</IconButtonSoft>
          <IconButtonSoft aria-label="Previous" variant="outline">←</IconButtonSoft>
          <IconButtonSoft aria-label="Add" size="lg">+</IconButtonSoft>
          <TextLinkSoft href="#">Lorem ipsum</TextLinkSoft>
        </div>
      </Section>
      <Section title="Labels">
        <div className="flex flex-wrap items-center gap-3">
          <TagSoft>Neutral</TagSoft>
          <TagSoft tone="red">Red</TagSoft>
          <TagSoft tone="yellow">Yellow</TagSoft>
          <TagSoft tone="blue">Blue</TagSoft>
          <ChipSoft icon="◷">Lorem</ChipSoft>
        </div>
      </Section>
      <Section title="Cards">
        <div className="grid gap-6 md:grid-cols-3">
          <ProjectCardSoft href="#" initial="L" title="Lorem" description="Ipsum dolor sit amet." tag={{ label: "Lorem" }} />
          <CardSoft header="Lorem" footer="Ipsum">Dolor sit amet, consectetur.</CardSoft>
          <div className="flex flex-col gap-3">
            <StackCardSoft tone="red">Lorem ipsum</StackCardSoft>
            <StackCardSoft tone="yellow">Dolor sit</StackCardSoft>
            <StackCardSoft tone="blue" action="+">Amet</StackCardSoft>
          </div>
        </div>
      </Section>
      <Section title="Widgets">
        <TabsSoft
          label="Lorem"
          items={[
            { id: "a", title: "Lorem", content: "Ipsum dolor sit amet." },
            { id: "b", title: "Ipsum", content: "Consectetur adipiscing." },
          ]}
        />
        <DateStripSoft label="Pick a day" start={new CalendarDate(2026, 11, 16)} defaultValue={new CalendarDate(2026, 11, 17)} />
        <CarouselSoft label="Lorem" className="max-w-md">
          <div className="flex h-40 items-end bg-bh-blue p-6 font-bh-display text-3xl font-light text-bh-paper">Lorem</div>
          <div className="flex h-40 items-end bg-bh-sand p-6 font-bh-display text-3xl font-light text-bh-ink">Ipsum</div>
        </CarouselSoft>
        <AudioPlayerSoft src="" title="Lorem ipsum" className="max-w-sm" />
        <BottomNavSoft
          label="Main"
          className="max-w-sm"
          items={[
            { href: "#", label: "Home", icon: "⌂", current: true },
            { href: "#", label: "Book", icon: "+" },
          ]}
        />
      </Section>
      <Section title="Forms">
        <div className="flex max-w-md flex-col gap-6">
          <TextFieldSoft label="Email" description="We only use it for receipts." />
          <TextFieldSoft label="Work email" defaultValue="name@" isInvalid errorMessage="Enter a valid email" />
          <TextAreaSoft label="Message" rows={3} />
          <SelectSoft
            label="Plan"
            placeholder="Choose a plan"
            items={[
              { id: "free", label: "Free" },
              { id: "team", label: "Team" },
              { id: "scale", label: "Scale" },
            ]}
          />
          <CheckboxSoft label="Send me product updates" defaultSelected />
          <CheckboxSoft label="Select all projects" isIndeterminate />
          <RadioGroupSoft
            label="Billing cycle"
            defaultValue="monthly"
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
          <SwitchSoft label="Email notifications" />
          <SwitchSoft label="Two-factor sign-in" defaultSelected />
        </div>
      </Section>
      <Section title="Data">
        <TableSoft
          aria-label="Projects"
          columns={projectColumns((row) => (
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className={row.status === "live" ? "size-2 rounded-full bg-bh-blue" : "size-2 rounded-full bg-bh-yellow"}
              />
              {row.status === "live" ? "Live" : "Draft"}
            </span>
          ))}
          rows={projects}
          getRowId={(row) => row.id}
          defaultSortDescriptor={{ column: "users", direction: "descending" }}
        />
      </Section>
      <Section title="Charts">
        <div className="grid gap-8 md:grid-cols-2">
          <BarChartSoft title="Visits per month" data={chartMonths} highlight="Feb" />
          <LineChartSoft title="Visits and signups" series={chartSeries} />
          <DonutChartSoft title="Spending by category" data={chartSpend} centerLabel="€100" centerCaption="Spent" />
          <div className="flex items-end gap-4">
            <BigNumber value="1,204" label="Signups" />
            <SparklineSoft title="Signups, last 7 days" hideTitle data={chartTrend} className="w-40" />
          </div>
        </div>
      </Section>
      <FooterSoft columns={["Lorem", "Ipsum", "Dolor"]} bottom="© 2026 Lorem" />
    </div>
  ),
};
