import { CalendarDate } from "@internationalized/date";
import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AudioPlayerSwiss } from "./AudioPlayerSwiss/AudioPlayerSwiss";
import { BottomNavSwiss } from "./BottomNavSwiss/BottomNavSwiss";
import { ButtonSwiss } from "./ButtonSwiss/ButtonSwiss";
import { CardSwiss } from "./CardSwiss/CardSwiss";
import { CarouselSwiss } from "./CarouselSwiss/CarouselSwiss";
import { ChipSwiss } from "./ChipSwiss/ChipSwiss";
import { DateStripSwiss } from "./DateStripSwiss/DateStripSwiss";
import { FooterSwiss } from "./FooterSwiss/FooterSwiss";
import { IconButtonSwiss } from "./IconButtonSwiss/IconButtonSwiss";
import { MenuOverlaySwiss } from "./MenuOverlaySwiss/MenuOverlaySwiss";
import { ProjectCardSwiss } from "./ProjectCardSwiss/ProjectCardSwiss";
import { StackCardSwiss } from "./StackCardSwiss/StackCardSwiss";
import { TabsSwiss } from "./TabsSwiss/TabsSwiss";
import { TagSwiss } from "./TagSwiss/TagSwiss";
import { TextLinkSwiss } from "./TextLinkSwiss/TextLinkSwiss";
import { TopBarSwiss } from "./TopBarSwiss/TopBarSwiss";
import { Grid } from "../primitives/Grid/Grid";
import { TextFieldSwiss } from "./TextFieldSwiss/TextFieldSwiss";
import { TextAreaSwiss } from "./TextAreaSwiss/TextAreaSwiss";
import { SelectSwiss } from "./SelectSwiss/SelectSwiss";
import { CheckboxSwiss } from "./CheckboxSwiss/CheckboxSwiss";
import { RadioGroupSwiss } from "./RadioGroupSwiss/RadioGroupSwiss";
import { SwitchSwiss } from "./SwitchSwiss/SwitchSwiss";
import { TableSwiss } from "./TableSwiss/TableSwiss";
import type { TableColumn } from "../_base/Table/tableTypes";
import { BarChartSwiss } from "./BarChartSwiss/BarChartSwiss";
import { LineChartSwiss } from "./LineChartSwiss/LineChartSwiss";
import { DonutChartSwiss } from "./DonutChartSwiss/DonutChartSwiss";
import { SparklineSwiss } from "./SparklineSwiss/SparklineSwiss";
import { BigNumber } from "../primitives/BigNumber/BigNumber";

const meta: Meta = {
  title: "Swiss/Overview",
  tags: ["swiss"],
  parameters: { backgrounds: { default: "white" } },
};
export default meta;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="flex flex-col gap-4 border-t border-bh-rule pt-8">
    <h2 className="font-bh-grotesk text-2xl font-normal tracking-[-0.03em]">{title}</h2>
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

const projectColumns = (status: (row: Project) => ReactNode): TableColumn<Project>[] => [
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

/** Every Swiss component on the paper-white ground, grouped by purpose. */
export const AllComponents: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-12 bg-bh-paper-white p-8 text-bh-ink">
      <TopBarSwiss
        brand="Konto"
        meta={["Personal account", "v0.4"]}
        action={
          <MenuOverlaySwiss
            triggerLabel="Menu"
            title="Account menu"
            links={[
              { href: "#accounts", label: "Accounts", current: true },
              { href: "#payments", label: "Payments" },
            ]}
          />
        }
      />
      <Section title="Actions">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonSwiss>Solid</ButtonSwiss>
          <ButtonSwiss variant="outline">Outline</ButtonSwiss>
          <ButtonSwiss variant="color">Accent</ButtonSwiss>
          <ButtonSwiss size="sm">Small pill</ButtonSwiss>
          <IconButtonSwiss aria-label="Next">→</IconButtonSwiss>
          <IconButtonSwiss aria-label="Previous" variant="solid">←</IconButtonSwiss>
          <IconButtonSwiss aria-label="Add" size="lg">+</IconButtonSwiss>
          <TextLinkSwiss href="#">View transactions</TextLinkSwiss>
        </div>
      </Section>
      <Section title="Labels">
        <div className="flex flex-wrap items-center gap-3">
          <TagSwiss>Verified</TagSwiss>
          <ChipSwiss icon="◷">1 Day</ChipSwiss>
        </div>
      </Section>
      <Section title="Cards">
        <Grid cols={3} ruled className="[&>*]:bg-bh-paper-white">
          <ProjectCardSwiss
            href="#"
            initial="A"
            title="Account A"
            description="Long-term savings with a clear transaction history."
            tag={{ label: "New" }}
          />
          <CardSwiss header="Account summary" footer="Updated just now">
            Your available balance is CHF 12,480.
          </CardSwiss>
          <div className="flex flex-col gap-3 p-4">
            <StackCardSwiss>Pending · Account A</StackCardSwiss>
            <StackCardSwiss action="+">Scheduled · Account B</StackCardSwiss>
          </div>
        </Grid>
      </Section>
      <Section title="Widgets">
        <TabsSwiss
          label="Statement period"
          items={[
            { id: "daily", title: "Daily", content: "Eight transactions today." },
            { id: "monthly", title: "Monthly", content: "146 transactions this month." },
          ]}
        />
        <DateStripSwiss
          label="Payment date"
          start={new CalendarDate(2026, 11, 16)}
          defaultValue={new CalendarDate(2026, 11, 17)}
        />
        <CarouselSwiss label="Accounts" className="max-w-md">
          <div className="flex h-40 items-end border border-bh-rule p-6 font-bh-grotesk text-3xl">
            Account A
          </div>
          <div className="flex h-40 items-end border border-bh-rule p-6 font-bh-grotesk text-3xl">
            Savings B
          </div>
        </CarouselSwiss>
        <AudioPlayerSwiss src="" title="Account update" className="max-w-md" />
        <BottomNavSwiss
          label="Main"
          className="max-w-sm"
          showLabels
          items={[
            { href: "#home", label: "Home", icon: "⌂", current: true },
            { href: "#pay", label: "Pay", icon: "+" },
          ]}
        />
      </Section>
      <Section title="Forms">
        <div className="flex max-w-md flex-col gap-6">
          <TextFieldSwiss label="Email" description="We only use it for receipts." />
          <TextFieldSwiss label="Work email" defaultValue="name@" isInvalid errorMessage="Enter a valid email" />
          <TextAreaSwiss label="Message" rows={3} />
          <SelectSwiss
            label="Plan"
            placeholder="Choose a plan"
            items={[
              { id: "free", label: "Free" },
              { id: "team", label: "Team" },
              { id: "scale", label: "Scale" },
            ]}
          />
          <CheckboxSwiss label="Send me product updates" defaultSelected />
          <CheckboxSwiss label="Select all projects" isIndeterminate />
          <RadioGroupSwiss
            label="Billing cycle"
            defaultValue="monthly"
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
          <SwitchSwiss label="Email notifications" />
          <SwitchSwiss label="Two-factor sign-in" defaultSelected />
        </div>
      </Section>
      <Section title="Data">
        <TableSwiss
          aria-label="Projects"
          columns={projectColumns((row) => (
            <span className={row.status === "live" ? "text-bh-ink" : "text-bh-muted-text"}>
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
          <BarChartSwiss title="Visits per month" data={chartMonths} highlight="Feb" />
          <LineChartSwiss title="Visits and signups" series={chartSeries} />
          <DonutChartSwiss title="Spending by category" data={chartSpend} centerLabel="€100" centerCaption="Spent" />
          <div className="flex items-end gap-4">
            <BigNumber value="1,204" label="Signups" />
            <SparklineSwiss title="Signups, last 7 days" hideTitle data={chartTrend} className="w-40" />
          </div>
        </div>
      </Section>
      <FooterSwiss columns={["Accounts", "Support", "Legal"]} bottom="© 2026 Konto" />
    </div>
  ),
};
