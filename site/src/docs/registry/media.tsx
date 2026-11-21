import {
  AudioPlayerPlayful,
  AudioPlayerSoft,
  AudioPlayerSwiss,
  Avatar,
  CardPlayful,
  CardSoft,
  CardSwiss,
  MediaBlock,
  ProjectCardPlayful,
  ProjectCardSoft,
  ProjectCardSwiss,
  QuoteBlock,
  StackCardPlayful,
  StackCardSoft,
  StackCardSwiss,
} from "bauhaus-react";
import { DEMO_IMAGE, flag, imports, skins, text } from "./helpers";
import type { DocEntry } from "./types";

const AUDIO = `${import.meta.env.BASE_URL}silence.wav`;

export const MEDIA: DocEntry[] = [
  {
    slug: "audio-player",
    title: "AudioPlayer",
    group: "Media & cards",
    purpose: "A native audio element with a play button, a seek slider and the elapsed time.",
    principles: ["p2", "p10"],
    looks: skins(
      "AudioPlayer",
      { playful: AudioPlayerPlayful, swiss: AudioPlayerSwiss, soft: AudioPlayerSoft },
      (C, v) => <C src={AUDIO} title={text(v, "title")} className="w-full" />,
      (n) => `${imports(n)}\n\n<${n} src="/audio/demo.mp3" title="Demo track" />`,
    ),
    controls: [{ prop: "title", kind: "text", initial: "Demo track" }],
    dos: ["Always give it a title: it names the play button.", "Pass a captions track as children when the audio has speech."],
    donts: ["Do not autoplay."],
    a11y: ["The seek control is a slider with arrow-key support.", "Play and pause are one button whose name changes with the state."],
  },
  {
    slug: "card",
    title: "Card",
    group: "Media & cards",
    purpose: "A content panel with optional header and footer. With href the whole card becomes one link.",
    principles: ["p8", "p9"],
    looks: skins(
      "Card",
      { playful: CardPlayful, swiss: CardSwiss, soft: CardSoft },
      (C, v) => (
        <C header={text(v, "header")} footer={flag(v, "footer") ? "Updated today" : undefined} className="w-full max-w-sm">
          <p>Notes on grids, type and colour fields.</p>
        </C>
      ),
      (n) => `${imports(n)}\n\n<${n} header="Notes" footer="Updated today">\n  <p>Notes on grids, type and colour fields.</p>\n</${n}>`,
    ),
    controls: [
      { prop: "header", kind: "text", initial: "Notes" },
      { prop: "footer", kind: "boolean", initial: true },
    ],
    dos: ["Use href for a card that is one big link; avoid links inside it then."],
    donts: ["Do not nest cards."],
    a11y: ["An article element, or one anchor when it has href.", "Link cards show a focus ring around the whole card."],
  },
  {
    slug: "stack-card",
    title: "StackCard",
    group: "Media & cards",
    purpose: "A list-item card with a coloured spine and an optional trailing action.",
    principles: ["p5", "p8"],
    looks: skins(
      "StackCard",
      { playful: StackCardPlayful, swiss: StackCardSwiss, soft: StackCardSoft },
      (C, v) => (
        <C action={flag(v, "action") ? <span aria-hidden="true">+</span> : undefined} className="w-full max-w-sm">
          {text(v, "text")}
        </C>
      ),
      (n) => `${imports(n)}\n\n<${n} action={<IconButtonPlayful aria-label="Add">+</IconButtonPlayful>}>Double room</${n}>`,
    ),
    controls: [
      { prop: "text", kind: "text", initial: "Double room" },
      { prop: "action", kind: "boolean", initial: true },
    ],
    dos: ["Stack them in a list to build a booking or order summary."],
    donts: ["Do not rely on the spine colour alone to carry meaning."],
    a11y: ["The spine is decorative. A trailing action must be a real button with a name."],
  },
  {
    slug: "project-card",
    title: "ProjectCard",
    group: "Media & cards",
    purpose: "A link card for a project: a giant initial, a title, a short description and a tag.",
    principles: ["p4", "p6"],
    looks: skins(
      "ProjectCard",
      { playful: ProjectCardPlayful, swiss: ProjectCardSwiss, soft: ProjectCardSoft },
      (C, v, look) => (
        <C
          href="#"
          initial={text(v, "title").slice(0, 1).toUpperCase() || "M"}
          title={text(v, "title")}
          description="Identity for a modular furniture maker."
          tag={{ label: "Brand" }}
          headingLevel={3}
          {...(look === "playful" ? { color: v.color } : {})}
          className="w-full max-w-xs"
        />
      ),
      (n) =>
        `${imports(n)}\n\n<${n} href="/work/modulo" initial="M" title="Modulo" description="Identity for a modular furniture maker." tag={{ label: "Brand" }} />`,
    ),
    controls: [
      { prop: "title", kind: "text", initial: "Modulo" },
      { prop: "color", kind: "select", options: ["red", "blue", "yellow"], initial: "red" },
    ],
    dos: ["Set headingLevel so the title fits the page outline."],
    donts: ["Do not use a long title: the card is built for one or two words."],
    a11y: ["The whole card is one link named by its title.", "The giant initial is decorative and hidden from assistive tech."],
  },
  {
    slug: "avatar",
    title: "Avatar",
    group: "Media & cards",
    purpose: "A circular portrait, optionally with concentric rings behind it.",
    principles: ["p4", "p10"],
    agnostic: {
      exportNames: ["Avatar"],
      demo: (v) => (
        <Avatar
          src={DEMO_IMAGE}
          alt="Portrait of a member of the studio"
          rings={Number(text(v, "rings")) as 0 | 1 | 2 | 3}
          size={text(v, "size") as "sm" | "md" | "lg"}
        />
      ),
      snippet: `${imports("Avatar")}\n\n<Avatar src="/people/ana.jpg" alt="Ana, studio lead" rings={2} size="lg" />`,
    },
    controls: [
      { prop: "rings", kind: "select", options: ["0", "1", "2", "3"], initial: "2" },
      { prop: "size", kind: "select", options: ["sm", "md", "lg"], initial: "md" },
    ],
    dos: ["Describe the person in alt, or pass an empty alt if the name is next to it."],
    donts: ["Do not crop faces to fit: the circle is the crop."],
    a11y: ["alt is required by the type."],
  },
  {
    slug: "media-block",
    title: "MediaBlock",
    group: "Media & cards",
    purpose: "A black-and-white image placed over a flat colour block.",
    principles: ["p7", "p5"],
    agnostic: {
      exportNames: ["MediaBlock"],
      demo: (v) => (
        <MediaBlock src={DEMO_IMAGE} alt="A composition of a circle, a square and a triangle" color={text(v, "color") as "red" | "blue" | "yellow"} className="w-56" />
      ),
      snippet: `${imports("MediaBlock")}\n\n<MediaBlock src="/img/building.jpg" alt="The Dessau building" color="blue" />`,
    },
    controls: [{ prop: "color", kind: "select", options: ["blue", "red", "yellow"], initial: "blue" }],
    dos: ["Use photography: the image is shown in black and white so the colour block leads."],
    donts: ["Do not put text over the image."],
    a11y: ["alt is required."],
  },
  {
    slug: "quote-block",
    title: "QuoteBlock",
    group: "Media & cards",
    purpose: "A quotation with an oversized, faded quote mark and an optional source.",
    principles: ["p6", "p9"],
    agnostic: {
      exportNames: ["QuoteBlock"],
      demo: (v) => (
        <QuoteBlock cite={flag(v, "cite") ? "Walter Gropius" : undefined} className="w-full max-w-lg">
          {text(v, "quote")}
        </QuoteBlock>
      ),
      snippet: `${imports("QuoteBlock")}\n\n<QuoteBlock cite="Walter Gropius">Art and technology, a new unity.</QuoteBlock>`,
    },
    controls: [
      { prop: "quote", kind: "text", initial: "Art and technology, a new unity." },
      { prop: "cite", kind: "boolean", initial: true },
    ],
    dos: ["Attribute every quote."],
    donts: ["Do not use it for long passages."],
    a11y: ["A blockquote with a cite footer. The quote mark is decorative."],
  },
];
