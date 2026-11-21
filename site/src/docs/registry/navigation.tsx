import {
  ArrowLink,
  BottomNavPlayful,
  BottomNavSoft,
  BottomNavSwiss,
  CarouselPlayful,
  CarouselSoft,
  CarouselSwiss,
  FooterPlayful,
  FooterSoft,
  FooterSwiss,
  Stepper,
  TabsPlayful,
  TabsSoft,
  TabsSwiss,
  TopBarPlayful,
  TopBarSoft,
  TopBarSwiss,
} from "bauhaus-react";
import { flag, imports, skins, text } from "./helpers";
import type { DocEntry } from "./types";

const SLIDE = "grid min-h-32 place-items-center bg-bh-paper font-bh-display text-2xl font-bold";

export const NAVIGATION: DocEntry[] = [
  {
    slug: "top-bar",
    title: "TopBar",
    group: "Navigation",
    purpose: "The header of a page: a brand cell, small info cells, and an action on the right.",
    principles: ["p8", "p6"],
    looks: skins(
      "TopBar",
      { playful: TopBarPlayful, swiss: TopBarSwiss, soft: TopBarSoft },
      (C, v) => (
        <C
          brand={text(v, "brand")}
          meta={flag(v, "meta") ? ["Portfolio", "Est. 2019"] : undefined}
          action={<a href="#" className="underline underline-offset-4">Contact</a>}
          className="w-full"
        />
      ),
      (n) => `${imports(n)}\n\n<${n} brand="Studio Modulo" meta={["Portfolio", "Est. 2019"]} action={<a href="/contact">Contact</a>} />`,
    ),
    controls: [
      { prop: "brand", kind: "text", initial: "Studio Modulo" },
      { prop: "meta", kind: "boolean", initial: true },
    ],
    dos: ["Keep the brand short.", "Put one action on the right."],
    donts: ["Do not fill every cell: the grid works because of its empty space."],
    a11y: ["Renders a header landmark.", "Meta cells appear from the md breakpoint; do not hide essential links there."],
  },
  {
    slug: "bottom-nav",
    title: "BottomNav",
    group: "Navigation",
    purpose: "An icon navigation bar fixed to the foot of a mobile screen.",
    principles: ["p2", "p10"],
    looks: skins(
      "BottomNav",
      { playful: BottomNavPlayful, swiss: BottomNavSwiss, soft: BottomNavSoft },
      (C, v) => (
        <C
          label="App sections"
          showLabels={flag(v, "labels")}
          className="w-full"
          items={[
            { href: "#home", label: "Home", icon: "●", current: true },
            { href: "#stats", label: "Stats", icon: "■" },
            { href: "#plan", label: "Plan", icon: "▲" },
          ]}
        />
      ),
      (n) => `${imports(n)}\n\n<${n} label="App sections" showLabels items={[{ href: "/", label: "Home", icon: "●", current: true }]} />`,
    ),
    controls: [{ prop: "labels", kind: "boolean", initial: true }],
    dos: ["Limit it to three to five destinations.", "Mark the current one with current: true."],
    donts: ["Do not use icons without labels unless they are universally understood."],
    a11y: ["A nav landmark named by label; the current link has aria-current=\"page\".", "With showLabels off the text stays available to screen readers."],
  },
  {
    slug: "footer",
    title: "Footer",
    group: "Navigation",
    purpose: "The foot of a page: columns of links and a bottom line.",
    principles: ["p8", "p9"],
    looks: skins(
      "Footer",
      { playful: FooterPlayful, swiss: FooterSwiss, soft: FooterSoft },
      (C) => (
        <C
          className="w-full"
          columns={[
            <ul key="a"><li>Work</li><li>About</li></ul>,
            <ul key="b"><li>Docs</li><li>GitHub</li></ul>,
          ]}
          bottom="© 2026 bauhaus-react"
        />
      ),
      (n) => `${imports(n)}\n\n<${n} columns={[<ul>…</ul>, <ul>…</ul>]} bottom="© 2026" />`,
    ),
    controls: [],
    dos: ["Group links by purpose, one column each."],
    donts: ["Do not repeat the whole header menu."],
    a11y: ["Renders a footer landmark.", "Links inside the columns are ordinary links with focus rings."],
  },
  {
    slug: "tabs",
    title: "Tabs",
    group: "Navigation",
    purpose: "Switch between panels of related content without leaving the page.",
    principles: ["p2", "p8"],
    looks: skins(
      "Tabs",
      { playful: TabsPlayful, swiss: TabsSwiss, soft: TabsSoft },
      (C, v) => (
        <C
          label={text(v, "label")}
          items={[
            { id: "work", title: "Work", content: <p className="py-4">Selected projects.</p> },
            { id: "play", title: "Play", content: <p className="py-4">Experiments and sketches.</p> },
            { id: "rest", title: "Rest", content: <p className="py-4">Writing and notes.</p>, disabled: flag(v, "lastDisabled") },
          ]}
        />
      ),
      (n) => `${imports(n)}\n\n<${n} label="Sections" items={[{ id: "work", title: "Work", content: <p>…</p> }]} />`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Sections" },
      { prop: "lastDisabled", kind: "boolean", initial: false },
    ],
    dos: ["Keep tab titles to one word."],
    donts: ["Do not use tabs for steps that must be done in order."],
    a11y: ["Arrow keys move between tabs; disabled tabs are skipped.", "The tab list is named by label."],
  },
  {
    slug: "carousel",
    title: "Carousel",
    group: "Navigation",
    purpose: "A row of slides with previous and next controls and a pager.",
    principles: ["p11", "p8"],
    looks: skins(
      "Carousel",
      { playful: CarouselPlayful, swiss: CarouselSwiss, soft: CarouselSoft },
      (C, v) => (
        <C label={text(v, "label")} className="w-full">
          <div className={SLIDE}>One</div>
          <div className={SLIDE}>Two</div>
          <div className={SLIDE}>Three</div>
        </C>
      ),
      (n) => `${imports(n)}\n\n<${n} label="Selected work">\n  <div>One</div>\n  <div>Two</div>\n</${n}>`,
    ),
    controls: [{ prop: "label", kind: "text", initial: "Selected work" }],
    dos: ["Keep slides to the same height."],
    donts: ["Do not auto-advance: let people move at their own pace."],
    a11y: ["Previous and next are buttons; the pager is announced.", "Slide changes never steal focus."],
  },
  {
    slug: "stepper",
    title: "Stepper",
    group: "Navigation",
    purpose: "Vertical numbered dots joined by a dashed line. Colours can encode meaning.",
    principles: ["p4", "p5"],
    agnostic: {
      exportNames: ["Stepper"],
      demo: (v) => (
        <Stepper
          current={Number(text(v, "current")) || 0}
          steps={[{ label: "Brief" }, { label: "Sketch", color: "yellow" }, { label: "Build", color: "red" }, { label: "Ship", color: "blue" }]}
        />
      ),
      snippet: `${imports("Stepper")}\n\n<Stepper current={1} steps={[{ label: "Brief" }, { label: "Sketch", color: "yellow" }]} />`,
    },
    controls: [{ prop: "current", kind: "select", options: ["0", "1", "2", "3"], initial: "1" }],
    dos: ["Use the colour pairing: yellow with triangles, red with squares, blue with circles."],
    donts: ["Do not use it for more than six steps."],
    a11y: ["An ordered list: the current step is exposed to assistive tech.", "Do not rely on colour to show which step is current."],
  },
  {
    slug: "arrow-link",
    title: "ArrowLink",
    group: "Navigation",
    purpose: "A text link with a directional arrow, in sizes up to hero.",
    principles: ["p6", "p9"],
    agnostic: {
      exportNames: ["ArrowLink"],
      demo: (v) => (
        <ArrowLink href="#" direction={text(v, "direction") as "right" | "up-right"} size={text(v, "size") as "sm" | "md" | "lg"}>
          {text(v, "label")}
        </ArrowLink>
      ),
      snippet: `${imports("ArrowLink")}\n\n<ArrowLink href="/work" direction="up-right" size="lg">See all work</ArrowLink>`,
    },
    controls: [
      { prop: "label", kind: "text", initial: "See all work" },
      { prop: "direction", kind: "select", options: ["right", "up-right"], initial: "right" },
      { prop: "size", kind: "select", options: ["sm", "md", "lg"], initial: "md" },
    ],
    dos: ["Use one per section."],
    donts: ["Do not use it for minor links."],
    a11y: ["A plain anchor: the arrow is decorative."],
  },
];
