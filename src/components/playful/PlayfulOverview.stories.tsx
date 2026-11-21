import { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ButtonPlayful } from "./ButtonPlayful/ButtonPlayful";
import { IconButtonPlayful } from "./IconButtonPlayful/IconButtonPlayful";
import { TextLinkPlayful } from "./TextLinkPlayful/TextLinkPlayful";
import { TagPlayful } from "./TagPlayful/TagPlayful";
import { ChipPlayful } from "./ChipPlayful/ChipPlayful";
import { ProjectCardPlayful } from "./ProjectCardPlayful/ProjectCardPlayful";
import { CardPlayful } from "./CardPlayful/CardPlayful";
import { StackCardPlayful } from "./StackCardPlayful/StackCardPlayful";
import { TopBarPlayful } from "./TopBarPlayful/TopBarPlayful";
import { FooterPlayful } from "./FooterPlayful/FooterPlayful";
import { BottomNavPlayful } from "./BottomNavPlayful/BottomNavPlayful";
import { TabsPlayful } from "./TabsPlayful/TabsPlayful";
import { MenuOverlayPlayful } from "./MenuOverlayPlayful/MenuOverlayPlayful";
import { CarouselPlayful } from "./CarouselPlayful/CarouselPlayful";
import { DateStripPlayful } from "./DateStripPlayful/DateStripPlayful";
import { AudioPlayerPlayful } from "./AudioPlayerPlayful/AudioPlayerPlayful";
import { TextFieldPlayful } from "./TextFieldPlayful/TextFieldPlayful";
import { TextAreaPlayful } from "./TextAreaPlayful/TextAreaPlayful";
import { SelectPlayful } from "./SelectPlayful/SelectPlayful";
import { CheckboxPlayful } from "./CheckboxPlayful/CheckboxPlayful";
import { RadioGroupPlayful } from "./RadioGroupPlayful/RadioGroupPlayful";
import { SwitchPlayful } from "./SwitchPlayful/SwitchPlayful";
import { TablePlayful } from "./TablePlayful/TablePlayful";
import type { TableColumn } from "../_base/Table/tableTypes";

const meta: Meta = { title: "Playful/Overview" };
export default meta;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-4 border-t-2 border-bh-ink pt-4">
    <h2 className="font-bh-body text-xs uppercase tracking-[0.1em]">{title}</h2>
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

/** Every Playful component on the Playful ground. */
export const AllComponents: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-10 bg-bh-paper p-8 text-bh-ink">
      <TopBarPlayful
        brand="Lorem"
        meta={["Ipsum", "v0.2"]}
        action={<MenuOverlayPlayful triggerLabel="Menu" title="Site menu" links={[{ href: "#a", label: "Lorem" }]} />}
      />
      <Section title="Actions">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonPlayful>Lorem</ButtonPlayful>
          <ButtonPlayful variant="outline">Ipsum</ButtonPlayful>
          <ButtonPlayful variant="color" color="red">
            Dolor
          </ButtonPlayful>
          <IconButtonPlayful aria-label="Next">→</IconButtonPlayful>
          <IconButtonPlayful aria-label="Add" size="lg">
            +
          </IconButtonPlayful>
          <TextLinkPlayful href="#" arrow="right">
            Sit amet
          </TextLinkPlayful>
        </div>
      </Section>
      <Section title="Labels">
        <div className="flex flex-wrap gap-3">
          <TagPlayful>Lorem</TagPlayful>
          <TagPlayful color="pink">Ipsum</TagPlayful>
          <ChipPlayful>Dolor sit</ChipPlayful>
        </div>
      </Section>
      <Section title="Cards">
        <div className="grid gap-6 md:grid-cols-3">
          <ProjectCardPlayful href="#" initial="L" title="Lorem" description="Ipsum dolor" color="sky" />
          <CardPlayful header="Lorem">Ipsum dolor sit amet.</CardPlayful>
          <div className="flex flex-col gap-3">
            <StackCardPlayful color="yellow">Lorem</StackCardPlayful>
            <StackCardPlayful color="blue">Ipsum</StackCardPlayful>
          </div>
        </div>
      </Section>
      <Section title="Widgets">
        <TabsPlayful
          label="Lorem"
          items={[
            { id: "a", title: "Lorem", content: "Lorem ipsum." },
            { id: "b", title: "Ipsum", content: "Dolor sit." },
          ]}
        />
        <DateStripPlayful label="Pick a day" start={new CalendarDate(2026, 11, 16)} />
        <CarouselPlayful label="Lorem" className="max-w-md">
          <div className="h-32 bg-bh-red" />
          <div className="h-32 bg-bh-yellow" />
        </CarouselPlayful>
        <AudioPlayerPlayful src="" title="Lorem" className="max-w-md" />
      </Section>
      <Section title="Forms">
        <div className="flex max-w-md flex-col gap-6">
          <TextFieldPlayful label="Email" description="We only use it for receipts." />
          <TextFieldPlayful label="Work email" defaultValue="name@" isInvalid errorMessage="Enter a valid email" />
          <TextAreaPlayful label="Message" rows={3} />
          <SelectPlayful
            label="Plan"
            placeholder="Choose a plan"
            items={[
              { id: "free", label: "Free" },
              { id: "team", label: "Team" },
              { id: "scale", label: "Scale" },
            ]}
          />
          <CheckboxPlayful label="Send me product updates" defaultSelected />
          <CheckboxPlayful label="Select all projects" isIndeterminate />
          <RadioGroupPlayful
            label="Billing cycle"
            defaultValue="monthly"
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
          <SwitchPlayful label="Email notifications" />
          <SwitchPlayful label="Two-factor sign-in" defaultSelected />
        </div>
      </Section>
      <Section title="Data">
        <TablePlayful
          aria-label="Projects"
          columns={projectColumns((row) => (
            <TagPlayful color={row.status === "live" ? "blue" : "yellow"} className="border-2 border-bh-ink">
              {row.status}
            </TagPlayful>
          ))}
          rows={projects}
          getRowId={(row) => row.id}
          defaultSortDescriptor={{ column: "users", direction: "descending" }}
        />
      </Section>
      <BottomNavPlayful
        label="Main"
        className="max-w-sm"
        items={[
          { href: "#a", label: "Lorem", icon: "■", current: true },
          { href: "#b", label: "Ipsum", icon: "●" },
        ]}
      />
      <FooterPlayful columns={["Lorem", "Ipsum", "Dolor"]} bottom="Sit amet" />
    </div>
  ),
};
