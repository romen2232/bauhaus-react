import {
  ButtonPlayful,
  ButtonSoft,
  ButtonSwiss,
  ChipPlayful,
  ChipSoft,
  ChipSwiss,
  IconButtonPlayful,
  IconButtonSoft,
  IconButtonSwiss,
  TagPlayful,
  TagSoft,
  TagSwiss,
  TextLinkPlayful,
  TextLinkSoft,
  TextLinkSwiss,
} from "bauhaus-react";
import { flag, imports, skins, text } from "./helpers";
import type { DocEntry } from "./types";

export const ACTIONS: DocEntry[] = [
  {
    slug: "button",
    title: "Button",
    group: "Actions",
    purpose: "Triggers an action, or navigates when given an href. Three looks; pick the one that matches the surface it sits on.",
    principles: ["p2", "p9"],
    looks: skins(
      "Button",
      { playful: ButtonPlayful, swiss: ButtonSwiss, soft: ButtonSoft },
      (C, v) => (
        <>
          <C variant={text(v, "variant")} size={text(v, "size")} disabled={flag(v, "disabled")}>
            {text(v, "label")}
          </C>
          <C href="#" variant="outline" size={text(v, "size")} disabled={flag(v, "disabled")}>
            As a link
          </C>
        </>
      ),
      (n) => `${imports(n)}\n\n<${n} variant="solid" size="md">Get started</${n}>\n<${n} href="/start" variant="outline">As a link</${n}>`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Get started" },
      { prop: "variant", kind: "select", options: ["solid", "outline"], initial: "solid" },
      { prop: "size", kind: "select", options: ["sm", "md", "lg"], initial: "md" },
      { prop: "disabled", kind: "boolean", initial: false },
    ],
    dos: ["Use one solid button per view for the main action.", "Pass href when the action navigates, so it renders a real link."],
    donts: ["Do not place a Soft button in the same row as Playful or Swiss components.", "Do not rely on colour alone to show a disabled state."],
    a11y: ["Native button or anchor: Enter and Space activate it.", "Every look draws a visible focus ring. Disabled buttons are removed from the tab order."],
  },
  {
    slug: "icon-button",
    title: "IconButton",
    group: "Actions",
    purpose: "A compact round or square button that holds a single glyph. It always needs an accessible name.",
    principles: ["p4", "p9"],
    looks: skins(
      "IconButton",
      { playful: IconButtonPlayful, swiss: IconButtonSwiss, soft: IconButtonSoft },
      (C, v) => (
        <C aria-label="Add item" variant={text(v, "variant")} size={text(v, "size")} disabled={flag(v, "disabled")}>
          +
        </C>
      ),
      (n) => `${imports(n)}\n\n<${n} aria-label="Add item" variant="solid" size="md">+</${n}>`,
    ),
    controls: [
      { prop: "variant", kind: "select", options: ["solid", "outline"], initial: "solid" },
      { prop: "size", kind: "select", options: ["sm", "md", "lg"], initial: "md" },
      { prop: "disabled", kind: "boolean", initial: false },
    ],
    dos: ["Always pass aria-label: the glyph alone is not a name.", "Use a familiar glyph for a familiar action."],
    donts: ["Do not use an icon button for an action that needs a text label to be understood.", "Do not shrink it below the sm size on touch screens."],
    a11y: ["aria-label is required by the type and names the button.", "Hit area follows the size prop; md and lg meet the 44px touch target."],
  },
  {
    slug: "text-link",
    title: "TextLink",
    group: "Actions",
    purpose: "An inline link with an optional arrow. Quieter than a button, for secondary navigation.",
    principles: ["p6", "p9"],
    looks: skins(
      "TextLink",
      { playful: TextLinkPlayful, swiss: TextLinkSwiss, soft: TextLinkSoft },
      (C, v) => (
        <C href="#" arrow={text(v, "arrow")}>
          {text(v, "label")}
        </C>
      ),
      (n) => `${imports(n)}\n\n<${n} href="/work" arrow="right">See the work</${n}>`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "See the work" },
      { prop: "arrow", kind: "select", options: ["right", "up-right", "down"], initial: "right" },
    ],
    dos: ["Use up-right for links that leave the site.", "Keep the label a verb phrase."],
    donts: ["Do not use a text link where an action needs a button.", "Do not stack several in one line without separators."],
    a11y: ["Renders an anchor; the arrow is decorative and hidden from assistive tech.", "Focus ring is drawn in every look."],
  },
  {
    slug: "chip",
    title: "Chip",
    group: "Actions",
    purpose: "A small pill for metadata such as a duration or a room type. Not interactive.",
    principles: ["p5", "p9"],
    looks: skins(
      "Chip",
      { playful: ChipPlayful, swiss: ChipSwiss, soft: ChipSoft },
      (C, v) => (
        <>
          <C>{text(v, "label")}</C>
          <C icon={<span aria-hidden="true">●</span>}>With icon</C>
        </>
      ),
      (n) => `${imports(n)}\n\n<${n}>1 Day</${n}>\n<${n} icon={<span aria-hidden="true">●</span>}>Double room</${n}>`,
    ),
    controls: [{ prop: "label", kind: "text", initial: "1 Day" }],
    dos: ["Keep chips to one or two words.", "Group related chips in one row."],
    donts: ["Do not make a chip look clickable: it is not a control.", "Do not use colour alone to carry meaning."],
    a11y: ["Plain inline text: read in order with surrounding content.", "Text contrast meets WCAG AA in every look."],
  },
  {
    slug: "tag",
    title: "Tag",
    group: "Actions",
    purpose: "A coloured label that classifies something: a status, a category, a release stage.",
    principles: ["p5", "p4"],
    looks: skins(
      "Tag",
      { playful: TagPlayful, swiss: TagSwiss, soft: TagSoft },
      (C, v, look) => <C {...(look === "playful" ? { color: v.color } : look === "soft" ? { tone: v.color } : {})}>{text(v, "label")}</C>,
      (n) => `${imports(n)}\n\n<${n}>Live</${n}>`,
    ),
    controls: [
      { prop: "label", kind: "text", initial: "Live" },
      { prop: "color", kind: "select", options: ["yellow", "red", "blue"], initial: "yellow" },
    ],
    dos: ["Pair the colour with a word, never colour alone.", "Reuse one colour per meaning across the product."],
    donts: ["Do not use yellow for text; it is a fill colour.", "Do not stack more than three tags on one item."],
    a11y: ["Rendered as a span: meaning comes from its text.", "Text colour is chosen per fill for AA contrast."],
  },
];
