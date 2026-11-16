import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { ButtonSoft } from "./ButtonSoft/ButtonSoft";
import { IconButtonSoft } from "./IconButtonSoft/IconButtonSoft";
import { TextLinkSoft } from "./TextLinkSoft/TextLinkSoft";
import { TagSoft } from "./TagSoft/TagSoft";
import { ChipSoft } from "./ChipSoft/ChipSoft";
import { CardSoft } from "./CardSoft/CardSoft";
import { StackCardSoft } from "./StackCardSoft/StackCardSoft";
import { ProjectCardSoft } from "./ProjectCardSoft/ProjectCardSoft";
import { TopBarSoft } from "./TopBarSoft/TopBarSoft";
import { FooterSoft } from "./FooterSoft/FooterSoft";
import { BottomNavSoft } from "./BottomNavSoft/BottomNavSoft";
import { CalendarDate } from "@internationalized/date";
import { MenuOverlaySoft } from "./MenuOverlaySoft/MenuOverlaySoft";
import { TabsSoft } from "./TabsSoft/TabsSoft";
import { DateStripSoft } from "./DateStripSoft/DateStripSoft";

// Soft look rules (spec §6.1): no borders, no hard shadow, no movement, yellow never as text.
const FORBIDDEN = /^(border(-[xytrbl])?(-\d+)?|shadow-bh-hard.*|-?translate-.*|text-bh-yellow)$/;

const cases: [string, ReactElement][] = [
  ["ButtonSoft solid", <ButtonSoft>Go</ButtonSoft>],
  ["ButtonSoft outline", <ButtonSoft variant="outline">Go</ButtonSoft>],
  ["ButtonSoft color", <ButtonSoft variant="color" tone="yellow">Go</ButtonSoft>],
  ["IconButtonSoft solid", <IconButtonSoft aria-label="Add">+</IconButtonSoft>],
  ["IconButtonSoft outline", <IconButtonSoft aria-label="Add" variant="outline">+</IconButtonSoft>],
  ["TextLinkSoft", <TextLinkSoft href="#">See times</TextLinkSoft>],
  ["TagSoft red", <TagSoft tone="red">Tag</TagSoft>],
  ["TagSoft yellow", <TagSoft tone="yellow">Tag</TagSoft>],
  ["TagSoft blue", <TagSoft tone="blue">Tag</TagSoft>],
  ["TagSoft neutral", <TagSoft tone="neutral">Tag</TagSoft>],
  ["ChipSoft", <ChipSoft icon="★">Chip</ChipSoft>],
  ["CardSoft", <CardSoft header="Head" footer="Foot">Body</CardSoft>],
  ["CardSoft link", <CardSoft href="#" header="Head">Body</CardSoft>],
  ["StackCardSoft", <StackCardSoft action="+">Room</StackCardSoft>],
  ["ProjectCardSoft", <ProjectCardSoft href="#" initial="A" title="Room" tag={{ label: "Free" }} media="img" />],
  ["TopBarSoft", <TopBarSoft brand="Rooms" meta={["Mon"]} action="Menu" />],
  ["FooterSoft", <FooterSoft columns={["About", "Help"]} bottom="©" />],
  ["BottomNavSoft", <BottomNavSoft label="Main" items={[{ href: "/", label: "Home", icon: "⌂", current: true }]} />],
  ["MenuOverlaySoft", <MenuOverlaySoft triggerLabel="Menu" title="Menu" links={[{ href: "#", label: "A", current: true }]} secondary="IG" defaultOpen />],
  ["TabsSoft", <TabsSoft label="View" items={[{ id: "a", title: "Day", content: "P" }]} />],
  ["DateStripSoft", <DateStripSoft label="Pick" start={new CalendarDate(2026, 11, 16)} />],
];

it.each(cases)("%s follows the Soft look rules", (_name, element) => {
  const { container } = render(element);
  const tokens = [...container.ownerDocument.body.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  const offending = tokens.filter((t) => FORBIDDEN.test(t.split(":").pop()!));
  expect(offending).toEqual([]);
});
