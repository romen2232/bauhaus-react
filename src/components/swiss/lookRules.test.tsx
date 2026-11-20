import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ButtonSwiss } from "./ButtonSwiss/ButtonSwiss";
import { IconButtonSwiss } from "./IconButtonSwiss/IconButtonSwiss";
import { TextLinkSwiss } from "./TextLinkSwiss/TextLinkSwiss";
import { TagSwiss } from "./TagSwiss/TagSwiss";
import { ChipSwiss } from "./ChipSwiss/ChipSwiss";
import { CardSwiss } from "./CardSwiss/CardSwiss";
import { StackCardSwiss } from "./StackCardSwiss/StackCardSwiss";
import { ProjectCardSwiss } from "./ProjectCardSwiss/ProjectCardSwiss";
import { TopBarSwiss } from "./TopBarSwiss/TopBarSwiss";
import { FooterSwiss } from "./FooterSwiss/FooterSwiss";
import { BottomNavSwiss } from "./BottomNavSwiss/BottomNavSwiss";
import { MenuOverlaySwiss } from "./MenuOverlaySwiss/MenuOverlaySwiss";
import { TabsSwiss } from "./TabsSwiss/TabsSwiss";
import { DateStripSwiss } from "./DateStripSwiss/DateStripSwiss";
import { CalendarDate } from "@internationalized/date";
import { CarouselSwiss } from "./CarouselSwiss/CarouselSwiss";
import { AudioPlayerSwiss } from "./AudioPlayerSwiss/AudioPlayerSwiss";
import { TextFieldSwiss } from "./TextFieldSwiss/TextFieldSwiss";
import { TextAreaSwiss } from "./TextAreaSwiss/TextAreaSwiss";
import { CheckboxSwiss } from "./CheckboxSwiss/CheckboxSwiss";
import { SwitchSwiss } from "./SwitchSwiss/SwitchSwiss";

const FORBIDDEN =
  /^(border(-[xytrbl])?-(2|4|8)|divide-[xy]-(2|4|8)|shadow(-.*)?|-?translate-.*|text-bh-yellow|text-bh-accent|rounded-bh-soft|font-bh-(display|body)|font-(medium|semibold|bold|extrabold|black)|(bg|text|border|divide)-bh-(red|yellow|blue|navy|sky|pink|orange|sand|paper|teal|khaki))$/;

type LookCase = [string, ReactElement, { pill?: boolean }?];

const cases: LookCase[] = [
  ["ButtonSwiss solid", <ButtonSwiss>Transfer</ButtonSwiss>],
  ["ButtonSwiss outline", <ButtonSwiss variant="outline">Transfer</ButtonSwiss>],
  ["ButtonSwiss color", <ButtonSwiss variant="color">Transfer</ButtonSwiss>],
  ["ButtonSwiss small", <ButtonSwiss size="sm">Transfer</ButtonSwiss>, { pill: true }],
  ["IconButtonSwiss outline", <IconButtonSwiss aria-label="Add">+</IconButtonSwiss>, { pill: true }],
  [
    "IconButtonSwiss solid",
    <IconButtonSwiss aria-label="Add" variant="solid">
      +
    </IconButtonSwiss>,
    { pill: true },
  ],
  ["TextLinkSwiss", <TextLinkSwiss href="#">See times</TextLinkSwiss>],
  ["TagSwiss", <TagSwiss>Open</TagSwiss>],
  ["ChipSwiss", <ChipSwiss icon="◷">1 Day</ChipSwiss>],
  ["CardSwiss", <CardSwiss header="Summary">Balance</CardSwiss>],
  ["CardSwiss link", <CardSwiss href="#" header="Summary">Balance</CardSwiss>],
  ["StackCardSwiss", <StackCardSwiss action="+">Account</StackCardSwiss>],
  [
    "ProjectCardSwiss",
    <ProjectCardSwiss href="#" initial="A" title="Account" tag={{ label: "New" }} media="Chart" />,
  ],
  ["TopBarSwiss", <TopBarSwiss brand="Konto" meta={["CHF"]} action="Menu" />],
  ["FooterSwiss", <FooterSwiss columns={["Accounts", "Support"]} bottom="©" />],
  [
    "BottomNavSwiss",
    <BottomNavSwiss label="Main" items={[{ href: "/", label: "Home", icon: "⌂", current: true }]} />,
  ],
  [
    "MenuOverlaySwiss",
    <MenuOverlaySwiss
      triggerLabel="Menu"
      title="Account menu"
      links={[{ href: "#", label: "Accounts", current: true }]}
      secondary="Help"
      defaultOpen
    />,
  ],
  [
    "TabsSwiss",
    <TabsSwiss label="Statement period" items={[{ id: "daily", title: "Daily", content: "Transactions" }]} />,
  ],
  ["DateStripSwiss", <DateStripSwiss label="Payment date" start={new CalendarDate(2026, 11, 16)} />],
  [
    "CarouselSwiss",
    <CarouselSwiss label="Accounts">
      <div>A</div>
      <div>B</div>
    </CarouselSwiss>,
    { pill: true },
  ],
  ["AudioPlayerSwiss", <AudioPlayerSwiss src="/a.mp3" title="Intro" />, { pill: true }],
  ["TextFieldSwiss", <TextFieldSwiss label="Name" />],
  ["TextFieldSwiss invalid", <TextFieldSwiss label="Name" isInvalid errorMessage="Required" />],
  ["TextAreaSwiss", <TextAreaSwiss label="Notes" />],
  ["TextAreaSwiss invalid", <TextAreaSwiss label="Notes" isInvalid errorMessage="Required" />],
  ["CheckboxSwiss", <CheckboxSwiss label="Terms" />],
  ["CheckboxSwiss invalid", <CheckboxSwiss label="Terms" isInvalid errorMessage="Required" />],
  ["CheckboxSwiss selected", <CheckboxSwiss label="Terms" defaultSelected />],
  ["SwitchSwiss", <SwitchSwiss label="Alerts" />],
  ["SwitchSwiss invalid", <SwitchSwiss label="Alerts" isInvalid errorMessage="Required" />],
  ["SwitchSwiss on", <SwitchSwiss label="Alerts" defaultSelected />],
];

it.each(cases)("%s follows the Swiss look rules", (_name, element, options) => {
  const { container } = render(element);
  const elements = [...container.ownerDocument.body.querySelectorAll("*")];
  const tokens = elements.flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  const offending = tokens.filter((token) => {
    const bare = token.split(":").pop()!;
    return (
      FORBIDDEN.test(bare) ||
      (bare.startsWith("rounded") &&
        bare !== "rounded-none" &&
        !(options?.pill && bare === "rounded-full"))
    );
  });
  expect(offending).toEqual([]);

  for (const el of elements) {
    const classes = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
    expect(classes.filter((token) => token.includes("bh-accent")).length).toBeLessThanOrEqual(1);
  }
});

it.each([
  ["CheckboxSwiss", <CheckboxSwiss label="Terms" isInvalid errorMessage="Required" />],
  ["SwitchSwiss", <SwitchSwiss label="Alerts" isInvalid errorMessage="Required" />],
])("Swiss invalid %s has exactly one bh-accent token", (_name, element) => {
  const { container } = render(element);
  const accents = [...container.ownerDocument.body.querySelectorAll("*")]
    .flatMap((el) => (el.getAttribute("class") ?? "").split(/\s+/))
    .filter((token) => token.includes("bh-accent"));
  expect(accents).toHaveLength(1);
});
