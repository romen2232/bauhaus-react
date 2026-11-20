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
      <FooterSwiss columns={["Accounts", "Support", "Legal"]} bottom="© 2026 Konto" />
    </div>
  ),
};
