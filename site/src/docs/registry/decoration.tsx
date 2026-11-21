import { Composition, KineticRule, Pattern, Ribbon, Shape, ShapeMosaic, SkewBar, Stamp } from "bauhaus-react";
import { flag, imports, text } from "./helpers";
import type { DocEntry } from "./types";

type Color = "red" | "yellow" | "blue" | "ink";

export const DECORATION: DocEntry[] = [
  {
    slug: "shape",
    title: "Shape",
    group: "Decoration",
    purpose: "A Bauhaus primitive: circle, quarter, half, triangle, square or bar. Size it with className.",
    principles: ["p4", "p5"],
    agnostic: {
      exportNames: ["Shape"],
      demo: (v) => (
        <div className="size-40">
          <Shape
            kind={text(v, "kind") as "circle" | "quarter" | "half" | "triangle" | "square" | "bar"}
            color={text(v, "color") as Color}
            rotate={Number(text(v, "rotate")) as 0 | 90 | 180 | 270}
            fill={text(v, "fill") as "solid" | "outline" | "pattern"}
            spin={flag(v, "spin")}
          />
        </div>
      ),
      snippet: `${imports("Shape")}\n\n<div className="size-40">\n  <Shape kind="triangle" color="yellow" rotate={90} />\n</div>`,
    },
    controls: [
      { prop: "kind", kind: "select", options: ["circle", "quarter", "half", "triangle", "square", "bar"], initial: "circle" },
      { prop: "color", kind: "select", options: ["blue", "red", "yellow", "ink"], initial: "blue" },
      { prop: "rotate", kind: "select", options: ["0", "90", "180", "270"], initial: "0" },
      { prop: "fill", kind: "select", options: ["solid", "outline", "pattern"], initial: "solid" },
      { prop: "spin", kind: "boolean", initial: false },
    ],
    dos: ["Pair colour and shape: yellow with triangles, red with squares, blue with circles."],
    donts: ["Do not add a gradient or a shadow to a shape."],
    a11y: ["Decorative: hidden from assistive tech. Spin stops when reduced motion is on."],
  },
  {
    slug: "shape-mosaic",
    title: "ShapeMosaic",
    group: "Decoration",
    purpose: "An edge-to-edge grid of shape tiles, for banners and section breaks.",
    principles: ["p4", "p8"],
    agnostic: {
      exportNames: ["ShapeMosaic"],
      demo: (v) => (
        <ShapeMosaic
          cols={Number(text(v, "cols")) as 3 | 4 | 6}
          className="w-full max-w-md"
          tiles={[
            { kind: "quarter", color: "blue", rotate: 90 },
            { kind: "square", color: "red" },
            { kind: "half", color: "blue", background: "ink" },
            { kind: "triangle", color: "yellow" },
            { kind: "circle", color: "blue", background: "red" },
            { kind: "quarter", color: "blue", rotate: 180 },
            { kind: "triangle", color: "yellow", rotate: 90 },
            { kind: "square", color: "ink" },
            { kind: "half", color: "blue", rotate: 180 },
            { kind: "circle", color: "ink" },
            { kind: "triangle", color: "yellow", background: "red", rotate: 180 },
            { kind: "bar", color: "ink" },
          ]}
        />
      ),
      snippet: `${imports("ShapeMosaic")}\n\n<ShapeMosaic cols={4} tiles={[{ kind: "quarter", color: "blue", rotate: 90 }, { kind: "square", color: "red" }]} />`,
    },
    controls: [{ prop: "cols", kind: "select", options: ["3", "4", "6"], initial: "4" }],
    dos: ["Let shapes touch across tiles to form larger figures."],
    donts: ["Do not centre a small shape in every tile."],
    a11y: ["Decorative and aria-hidden."],
  },
  {
    slug: "composition",
    title: "Composition",
    group: "Decoration",
    purpose: "Place anything on a grid by column and row, with spans: an asymmetric layout in a few lines.",
    principles: ["p8", "p4"],
    agnostic: {
      exportNames: ["Composition"],
      demo: () => (
        <Composition
          cols={3}
          rows={3}
          className="aspect-square w-56 border-2 border-bh-ink"
          cells={[
            { col: 1, row: 1, colSpan: 2, rowSpan: 2, node: <Shape kind="circle" color="blue" /> },
            { col: 3, row: 1, node: <Shape kind="square" color="red" /> },
            { col: 3, row: 2, node: <Shape kind="triangle" color="yellow" /> },
            { col: 1, row: 3, colSpan: 3, node: <Shape kind="bar" color="ink" /> },
          ]}
        />
      ),
      snippet: `${imports("Composition", "Shape")}\n\n<Composition cols={3} rows={3} cells={[{ col: 1, row: 1, colSpan: 2, rowSpan: 2, node: <Shape kind="circle" color="blue" /> }]} />`,
    },
    controls: [],
    dos: ["Leave cells empty: space is part of the composition."],
    donts: ["Do not place text so it depends on a particular cell size."],
    a11y: ["Layout only: nodes keep their own semantics."],
  },
  {
    slug: "pattern",
    title: "Pattern",
    group: "Decoration",
    purpose: "A decorative fill pattern: hatching, checker, grid paper, halftone or print grain. It fills its box.",
    principles: ["p5", "p9"],
    agnostic: {
      exportNames: ["Pattern"],
      demo: (v) => (
        <div className="relative size-40 border-2 border-bh-ink">
          <Pattern kind={text(v, "kind") as "hatch-vertical" | "hatch-horizontal" | "checker" | "grid-paper" | "halftone" | "grain"} color={text(v, "color") as Color} />
        </div>
      ),
      snippet: `${imports("Pattern")}\n\n<div className="relative size-40"><Pattern kind="checker" color="red" /></div>`,
    },
    controls: [
      { prop: "kind", kind: "select", options: ["hatch-vertical", "hatch-horizontal", "checker", "grid-paper", "halftone", "grain"], initial: "checker" },
      { prop: "color", kind: "select", options: ["red", "blue", "yellow", "ink"], initial: "red" },
    ],
    dos: ["Use it to give a flat shape texture."],
    donts: ["Do not put text on a pattern."],
    a11y: ["Decorative and aria-hidden."],
  },
  {
    slug: "ribbon",
    title: "Ribbon",
    group: "Decoration",
    purpose: "A diagonal band of repeated text across its container.",
    principles: ["p8", "p11"],
    agnostic: {
      exportNames: ["Ribbon"],
      demo: (v) => (
        <div className="w-full overflow-hidden py-8">
          <Ribbon text={text(v, "text")} angle={Number(text(v, "angle")) as 6 | 12 | -6 | -12} color={text(v, "color") as Color} />
        </div>
      ),
      snippet: `${imports("Ribbon")}\n\n<Ribbon text="Open for projects" angle={-6} color="yellow" />`,
    },
    controls: [
      { prop: "text", kind: "text", initial: "Open for projects" },
      { prop: "angle", kind: "select", options: ["-12", "-6", "6", "12"], initial: "-6" },
      { prop: "color", kind: "select", options: ["yellow", "red", "blue"], initial: "yellow" },
    ],
    dos: ["Keep the text to a short phrase."],
    donts: ["Do not stack more than one ribbon."],
    a11y: ["The text is read by assistive tech: keep it meaningful."],
  },
  {
    slug: "skew-bar",
    title: "SkewBar",
    group: "Decoration",
    purpose: "A parallelogram bar with an optional flat offset duplicate behind it (shadowColor).",
    principles: ["p8", "p5"],
    agnostic: {
      exportNames: ["SkewBar"],
      demo: (v) => <SkewBar label={text(v, "label")} color={text(v, "color") as Color} shadowColor="ink" />,
      snippet: `${imports("SkewBar")}\n\n<SkewBar label="New" color="red" shadowColor="ink" />`,
    },
    controls: [
      { prop: "label", kind: "text", initial: "New" },
      { prop: "color", kind: "select", options: ["red", "blue", "yellow"], initial: "red" },
    ],
    dos: ["Use it sparingly, as an accent."],
    donts: ["Do not skew body text."],
    a11y: ["The label is real text: keep it meaningful."],
  },
  {
    slug: "stamp",
    title: "Stamp",
    group: "Decoration",
    purpose: "A circular badge of text that can rotate. Size it with className.",
    principles: ["p11", "p4"],
    agnostic: {
      exportNames: ["Stamp"],
      demo: (v) => <Stamp text={text(v, "text")} color={text(v, "color") as Color} spin={flag(v, "spin")} />,
      snippet: `${imports("Stamp")}\n\n<Stamp text="Est. 1919 · Weimar · " color="red" spin />`,
    },
    controls: [
      { prop: "text", kind: "text", initial: "Est. 1919 · Weimar · " },
      { prop: "color", kind: "select", options: ["red", "blue", "yellow"], initial: "red" },
      { prop: "spin", kind: "boolean", initial: false },
    ],
    dos: ["Use for a status or a signature moment."],
    donts: ["Do not rely on the spin to carry meaning."],
    a11y: ["Spin is disabled under reduced motion."],
  },
  {
    slug: "kinetic-rule",
    title: "KineticRule",
    group: "Decoration",
    purpose: "A rule that grows and shrinks while a dot slides along it. Static under reduced motion.",
    principles: ["p11", "p9"],
    agnostic: {
      exportNames: ["KineticRule"],
      demo: (v) => <KineticRule color={text(v, "color") as Color} className="w-full" />,
      snippet: `${imports("KineticRule")}\n\n<KineticRule color="blue" />`,
    },
    controls: [{ prop: "color", kind: "select", options: ["blue", "red", "yellow"], initial: "blue" }],
    dos: ["Use it as a divider between large sections."],
    donts: ["Do not use more than one in view at a time."],
    a11y: ["Decorative and aria-hidden. Static under reduced motion."],
  },
];
