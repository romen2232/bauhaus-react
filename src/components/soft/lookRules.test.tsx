import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";
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
import { CarouselSoft } from "./CarouselSoft/CarouselSoft";
import { AudioPlayerSoft } from "./AudioPlayerSoft/AudioPlayerSoft";
import { TextFieldSoft } from "./TextFieldSoft/TextFieldSoft";
import { TextAreaSoft } from "./TextAreaSoft/TextAreaSoft";
import { CheckboxSoft } from "./CheckboxSoft/CheckboxSoft";
import { SwitchSoft } from "./SwitchSoft/SwitchSoft";
import { RadioGroupSoft } from "./RadioGroupSoft/RadioGroupSoft";
import { SelectSoft } from "./SelectSoft/SelectSoft";
import { BarChartSoft } from "./BarChartSoft/BarChartSoft";
import userEvent from "@testing-library/user-event";

// Soft look rules (spec §6.1): no borders, no hard shadow, no movement, yellow never as text.
const FORBIDDEN =
  /^(border(-[xytrbl])?(-\d+)?|shadow-bh-hard.*|-?translate-.*|text-bh-yellow|(fill|stroke)-bh-(navy|sky|pink|orange))$/;

const selectItems = [{ id: "a", label: "Apple" }];
const chartData = [
  { label: "Jan", value: 12 },
  { label: "Feb", value: 40 },
];

type LookCase = [string, ReactElement, { outline?: boolean }?];

const radioOptions = [
  { value: "a", label: "Email" },
  { value: "b", label: "Phone" },
];

const cases: LookCase[] = [
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
  ["CarouselSoft", <CarouselSoft label="Rooms"><div>A</div><div>B</div></CarouselSoft>],
  ["AudioPlayerSoft", <AudioPlayerSoft src="/a.mp3" title="Intro" />],
  ["TextFieldSoft", <TextFieldSoft label="Name" />, { outline: true }],
  ["TextFieldSoft invalid", <TextFieldSoft label="Name" isInvalid errorMessage="Required" />, { outline: true }],
  ["TextAreaSoft", <TextAreaSoft label="Notes" />, { outline: true }],
  ["TextAreaSoft invalid", <TextAreaSoft label="Notes" isInvalid errorMessage="Required" />, { outline: true }],
  ["CheckboxSoft", <CheckboxSoft label="Terms" />, { outline: true }],
  ["CheckboxSoft invalid", <CheckboxSoft label="Terms" isInvalid errorMessage="Required" />, { outline: true }],
  ["CheckboxSoft selected", <CheckboxSoft label="Terms" defaultSelected />, { outline: true }],
  ["SwitchSoft", <SwitchSoft label="Alerts" />, { outline: true }],
  ["SwitchSoft invalid", <SwitchSoft label="Alerts" isInvalid errorMessage="Required" />, { outline: true }],
  ["SwitchSoft on", <SwitchSoft label="Alerts" defaultSelected />, { outline: true }],
  ["RadioGroupSoft", <RadioGroupSoft label="Via" options={radioOptions} />, { outline: true }],
  ["RadioGroupSoft invalid", <RadioGroupSoft label="Via" options={radioOptions} isInvalid errorMessage="Required" />, { outline: true }],
  ["RadioGroupSoft selected", <RadioGroupSoft label="Via" options={radioOptions} defaultValue="a" tone="yellow" />, { outline: true }],
  ["SelectSoft", <SelectSoft label="Fruit" items={selectItems} />, { outline: true }],
  ["SelectSoft invalid", <SelectSoft label="Fruit" items={selectItems} isInvalid errorMessage="Required" />, { outline: true }],
  ["SelectSoft selected", <SelectSoft label="Fruit" items={selectItems} defaultSelectedKey="a" />, { outline: true }],
  ["BarChartSoft", <BarChartSoft title="Visits" data={chartData} />],
  ["BarChartSoft highlighted", <BarChartSoft title="Visits" data={chartData} highlight="Feb" tone="yellow" />],
];

it.each(cases)("%s follows the Soft look rules", (_name, element, options) => {
  const { container } = render(element);
  const tokens = [...container.ownerDocument.body.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  // Fields carry the 1px charcoal outline (plan decision A) so the boundary reaches 3:1 (WCAG 1.4.11).
  const offending = tokens.filter((t) => {
    const bare = t.split(":").pop()!;
    return FORBIDDEN.test(bare) && !(options?.outline && bare === "border");
  });
  expect(offending).toEqual([]);
});

it("SelectSoft popover follows the Soft look rules when open (no outline exemption)", async () => {
  render(<SelectSoft label="Fruit" items={selectItems} defaultSelectedKey="a" />);
  await userEvent.click(screen.getByRole("button", { name: /Fruit/ }));
  const popover = screen.getByRole("listbox").closest("[data-trigger]")!;
  const tokens = [popover, ...popover.querySelectorAll("*")].flatMap((el) =>
    (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean),
  );
  expect(tokens.filter((t) => FORBIDDEN.test(t.split(":").pop()!))).toEqual([]);
});
