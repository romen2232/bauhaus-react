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

const meta: Meta = { title: "Playful/Overview" };
export default meta;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="flex flex-col gap-4 border-t-2 border-bh-ink pt-4">
    <h2 className="font-bh-body text-xs uppercase tracking-[0.1em]">{title}</h2>
    {children}
  </section>
);

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
