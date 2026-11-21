import { Container, DisplayHeading, Grid, HighlightText, RuledList, SectionLabel, Wordmark } from "bauhaus-react";
import { flag, imports, text } from "./helpers";
import type { DocEntry } from "./types";

const CELL = "grid min-h-20 place-items-center bg-bh-paper font-bh-mono text-xs";

export const LAYOUT: DocEntry[] = [
  {
    slug: "container",
    title: "Container",
    group: "Layout & type",
    purpose: "A centred, padded wrapper that keeps content to a readable width. It can render as any landmark element.",
    principles: ["p8", "p2"],
    agnostic: {
      exportNames: ["Container"],
      demo: (v) => (
        <Container as={text(v, "as") as "div" | "section" | "main"} className="w-full border border-dashed border-bh-ink">
          <p className="py-6 text-center">Content stays inside the container.</p>
        </Container>
      ),
      snippet: `${imports("Container")}\n\n<Container as="main">…</Container>`,
    },
    controls: [{ prop: "as", kind: "select", options: ["div", "section", "main"], initial: "div" }],
    dos: ["Use the as prop to render the right landmark."],
    donts: ["Do not nest containers."],
    a11y: ["With as=\"main\", \"header\" or \"footer\" it provides the matching landmark."],
  },
  {
    slug: "grid",
    title: "Grid",
    group: "Layout & type",
    purpose: "A column grid with optional hairline rules between cells.",
    principles: ["p8", "p9"],
    agnostic: {
      exportNames: ["Grid"],
      demo: (v) => (
        <Grid cols={Number(text(v, "cols")) as 2 | 3 | 4} gap={text(v, "gap") as "none" | "sm" | "md"} ruled={flag(v, "ruled")} className="w-full">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className={CELL}>
              {i + 1}
            </div>
          ))}
        </Grid>
      ),
      snippet: `${imports("Grid")}\n\n<Grid cols={3} gap="sm" ruled>\n  <div>1</div>\n  <div>2</div>\n</Grid>`,
    },
    controls: [
      { prop: "cols", kind: "select", options: ["2", "3", "4"], initial: "3" },
      { prop: "gap", kind: "select", options: ["none", "sm", "md"], initial: "sm" },
      { prop: "ruled", kind: "boolean", initial: true },
    ],
    dos: ["Use ruled for editorial layouts where cells are the structure."],
    donts: ["Do not mix ruled cells and cards with shadows."],
    a11y: ["Pure layout: reading order follows the source order."],
  },
  {
    slug: "display-heading",
    title: "DisplayHeading",
    group: "Layout & type",
    purpose: "Giant geometric display type, with an optional offset echo behind it.",
    principles: ["p6", "p7"],
    agnostic: {
      exportNames: ["DisplayHeading"],
      demo: (v) => (
        <DisplayHeading as="h3" size={text(v, "size") as "xl" | "2xl"} echo={flag(v, "echo")}>
          {text(v, "text")}
        </DisplayHeading>
      ),
      snippet: `${imports("DisplayHeading")}\n\n<DisplayHeading as="h1" size="4xl" echo>Lorem ipsum</DisplayHeading>`,
    },
    controls: [
      { prop: "text", kind: "text", initial: "Form follows" },
      { prop: "size", kind: "select", options: ["xl", "2xl"], initial: "xl" },
      { prop: "echo", kind: "boolean", initial: false },
    ],
    dos: ["Choose the element with as so the heading fits the page outline."],
    donts: ["Do not use it for body copy."],
    a11y: ["The echo copy is decorative and hidden from assistive tech."],
  },
  {
    slug: "highlight-text",
    title: "HighlightText",
    group: "Layout & type",
    purpose: "A muted paragraph where HighlightText.Mark children stand out in ink.",
    principles: ["p5", "p9"],
    agnostic: {
      exportNames: ["HighlightText"],
      demo: (v) => (
        <HighlightText className="max-w-md text-lg">
          Form follows <HighlightText.Mark>{text(v, "text")}</HighlightText.Mark>, not decoration.
        </HighlightText>
      ),
      snippet: `${imports("HighlightText")}\n\n<HighlightText>\n  Form follows <HighlightText.Mark>function</HighlightText.Mark>.\n</HighlightText>`,
    },
    controls: [{ prop: "text", kind: "text", initial: "function" }],
    dos: ["Mark one phrase per paragraph."],
    donts: ["Do not mark whole sentences: the muted text is the contrast."],
    a11y: ["Marks render as strong text. Ink on the muted text keeps AA contrast."],
  },
  {
    slug: "section-label",
    title: "SectionLabel",
    group: "Layout & type",
    purpose: "An uppercase micro label with a parenthesised marker, like (A) Essay.",
    principles: ["p6", "p8"],
    agnostic: {
      exportNames: ["SectionLabel"],
      demo: (v) => <SectionLabel marker={text(v, "marker")}>{text(v, "label")}</SectionLabel>,
      snippet: `${imports("SectionLabel")}\n\n<SectionLabel marker="A">Essay</SectionLabel>`,
    },
    controls: [
      { prop: "marker", kind: "text", initial: "A" },
      { prop: "label", kind: "text", initial: "Essay" },
    ],
    dos: ["Keep markers to one or two characters."],
    donts: ["Do not use it as a heading."],
    a11y: ["A span: pair it with a real heading."],
  },
  {
    slug: "ruled-list",
    title: "RuledList",
    group: "Layout & type",
    purpose: "Items laid on hairline rules, optionally stepped across the row for an asymmetric staff layout.",
    principles: ["p8", "p9"],
    agnostic: {
      exportNames: ["RuledList"],
      demo: (v) => (
        <RuledList
          className="w-full"
          items={[
            { content: "01 Grid" },
            { content: "02 Type", offset: flag(v, "offset") ? 1 : 0 },
            { content: "03 Colour", offset: flag(v, "offset") ? 2 : 0 },
            { content: "04 Reduction", offset: flag(v, "offset") ? 3 : 0 },
          ]}
        />
      ),
      snippet: `${imports("RuledList")}\n\n<RuledList items={[{ content: "01 Grid" }, { content: "02 Type", offset: 1 }]} />`,
    },
    controls: [{ prop: "offset", kind: "boolean", initial: true }],
    dos: ["Use offsets to show hierarchy or sequence."],
    donts: ["Do not offset more than four steps."],
    a11y: ["A real list: offsets are visual only."],
  },
  {
    slug: "wordmark",
    title: "Wordmark",
    group: "Layout & type",
    purpose: "A giant word that shrinks to header size as you scroll. Pure CSS, no client code.",
    principles: ["p6", "p11"],
    agnostic: {
      exportNames: ["Wordmark"],
      demo: () => <Wordmark as="p" className="text-7xl">bauhaus</Wordmark>,
      snippet: `${imports("Wordmark")}\n\n<Wordmark>bauhaus</Wordmark>`,
    },
    controls: [],
    dos: ["Use it once per page, at the very top."],
    donts: ["Do not use it where scroll-driven animation is unsupported and the page needs a fixed header."],
    a11y: ["The scroll animation applies only when motion is allowed; otherwise the word stays still."],
  },
];
