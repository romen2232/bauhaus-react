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

const meta: Meta = { title: "Soft/Overview", parameters: { backgrounds: { default: "paper" } } };
export default meta;

// Soft separates by space and tonal fills, never by rules.
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-4">
    <h2 className="font-bh-display text-2xl font-light">{title}</h2>
    {children}
  </section>
);

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
      <FooterSoft columns={["Lorem", "Ipsum", "Dolor"]} bottom="© 2026 Lorem" />
    </div>
  ),
};
