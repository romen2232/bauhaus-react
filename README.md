# bauhaus-react

Bauhaus-style React components for **Tailwind CSS v4**: flat colour blocks, primitive shapes, hard shadows, giant geometric type.

The library mixes several Bauhaus-derived looks. Each look has its own components, and you mix looks by choosing which component to import:

| Look | Status | Suffix |
|---|---|---|
| Playful geometric | ✅ v0.2 | `*Playful` |
| Swiss editorial | ✅ v0.4 | `*Swiss` |
| Warm soft | ✅ v0.3 | `*Soft` |

Look-agnostic pieces (layout, type, decoration) have no suffix.

## Requirements

- React 19
- Tailwind CSS 4 in the consuming app

Interactive widgets (`Tabs*`, `MenuOverlay*`, `DateStrip*`, `AudioPlayer*`) are built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) and use `@internationalized/date` for dates. Both install automatically as dependencies. These components are marked `"use client"`; everything else is server-component safe.

## Install

```sh
pnpm add bauhaus-react
```

## Setup

Add the theme and tell Tailwind to scan the package, in your main CSS file:

```css
@import "tailwindcss";
@import "bauhaus-react/theme.css";
@source "../node_modules/bauhaus-react/dist";
```

Adjust the `@source` path so it is relative to your CSS file.

### Fonts

The package does not bundle fonts. The theme expects **Outfit** (display), **Inter** (body) and **Inter Tight** (grotesk display, used by `Wordmark` and the Swiss look), and falls back to system sans-serif:

```sh
pnpm add @fontsource/outfit @fontsource-variable/inter @fontsource/inter-tight
```

```css
@import "@fontsource/outfit/300.css"; /* Soft look: light weights */
@import "@fontsource/outfit/400.css";
@import "@fontsource/outfit/700.css";
@import "@fontsource/outfit/800.css";
@import "@fontsource-variable/inter";
@import "@fontsource/inter-tight/400.css";
```

## Usage

```tsx
import { ButtonPlayful, DisplayHeading, ProjectCardPlayful, Grid } from "bauhaus-react";

export function Hero() {
  return (
    <>
      <DisplayHeading as="h1" size="4xl" echo>Lorem ipsum</DisplayHeading>
      <ButtonPlayful href="/start">Get started</ButtonPlayful>
      <Grid cols={3} gap="sm">
        <ProjectCardPlayful href="/alpha" initial="A" title="Alpha" color="pink" />
      </Grid>
    </>
  );
}
```

All components accept `className`. Your classes win over the component's own classes, including `bh-*` tokens:

```tsx
<ButtonPlayful className="bg-bh-red">Red button</ButtonPlayful>
```

## Tokens

Every token is a CSS variable prefixed `bh-`, exposed as Tailwind utilities (`bg-bh-red`, `font-bh-display`, `shadow-bh-hard`, `animate-bh-spin`). To override one, redefine it after the import:

```css
@theme {
  --color-bh-red: #e63b2e;
}
```

Fill colours: `red`, `yellow`, `blue`, `navy`, `sky`, `pink`, `orange`, `ink`, `paper`. Components choose the text colour on each fill for WCAG AA contrast. Yellow is never used as a text colour.

Other tokens:

- `bh-sand`: a Soft surface colour (takes ink text).
- `bh-accent` (red by default): the Swiss look's single accent. Against white, it fails AA for small text (3.89:1) but passes for large text (24px+); Swiss components use it only as a fill or rule, with ink text. If you override `--color-bh-accent`, keep ink text readable on it.
- `rounded-bh-soft` (20px): a radius for Soft panels.
- `font-bh-grotesk`: Inter Tight.
- `animate-bh-slide` and `animate-bh-grow`: kinetic decoration loops.

Hard shadows take any colour: `shadow-bh-hard shadow-bh-red`.

### Soft tones

Soft components use colour only to encode meaning (status, category, step), through a `tone` prop of type `SoftTone`:

| Tone | Fill | Text |
|---|---|---|
| `red` | `bh-red` | `bh-ink` |
| `yellow` | `bh-yellow` | `bh-ink` |
| `blue` | `bh-blue` | `bh-paper` |
| `neutral` | `bh-charcoal` | `bh-paper` |

`SOFT_TONE_CLASSES` gives each pair as classes. Soft surfaces that are `charcoal` (`CardSoft`, `FooterSoft`) switch nested focus rings to paper; put paper-text content inside them, since ink text is not readable on charcoal. Soft hover is a 10% tonal step (`SOFT_HOVER_CLASSES`): every fill gets darker except `red`, which gets lighter, because a darker red drops ink text below AA contrast.

### Swiss look

Swiss components use a `paper-white` ground, `ink` text and `muted-text` → `ink` emphasis. Each component uses at most one `bh-accent`, only as a fill or rule. The default accent carries ink text (4.86:1) but not white text (3.89:1); if you override `--color-bh-accent`, keep ink text readable on it. Structural hairlines are 1px, geometry is square except for the specified circular controls and small button, and hover states change colour only.

`<Grid ruled>` paints `paper` cells by default. On a Swiss ground, override them with `className="[&>*]:bg-bh-paper-white"`.

## Components

| Component | What it is |
|---|---|
| `Container` | Centered max-width wrapper with gutters |
| `Grid` | Layout grid; `ruled` shows 1px grid lines |
| `DisplayHeading` | Giant geometric heading; `echo` adds an offset copy |
| `HighlightText` | Muted paragraph; `HighlightText.Mark` stands out in ink |
| `ArrowLink` | Link with `→` or `↗` |
| `IndexCounter` | Zero-padded index, `01 / 05` |
| `SectionLabel` | Section marker, `(P) Projects` |
| `BigNumber` | Numeral as hero, with label and caption |
| `NumberStepper` | Current number with the next ones ghosted |
| `StatColumns` | Ruled row of big-number columns |
| `ProgressRule` | Thin progress track; a `progressbar` when labelled |
| `RuledList` | Items on hairline rules, optionally offset |
| `Timeline` | Years in large type with content |
| `Stepper` | Numbered coloured dots joined by a dashed line |
| `Avatar` | Circular portrait with optional orbit rings |
| `MediaBlock` | Black-and-white image over a colour block |
| `QuoteBlock` | Quotation with an oversized quote mark |
| `Wordmark` | Giant word that shrinks on scroll (CSS only) |
| `ButtonPlayful` | Pill button: `solid`, `outline`, `color`; renders `<a>` with `href` |
| `IconButtonPlayful` | Circular icon button (`aria-label` required); `size="lg"` is the FAB; renders `<a>` with `href` |
| `TextLinkPlayful` | Text link with a thick underline and optional arrow |
| `TagPlayful` | Solid colour label |
| `ChipPlayful` | Ink metadata pill |
| `ProjectCardPlayful` | Colour card with giant initial; the whole card is a link |
| `CardPlayful` | Bordered content panel with hard shadow; a link with `href` |
| `StackCardPlayful` | List card with a coloured spine |
| `TopBarPlayful` | Header made of ruled cells |
| `FooterPlayful` | Ruled grid footer |
| `BottomNavPlayful` | Icon navigation bar; the current page gets a yellow pill |
| `TabsPlayful` | Tabs with pill selection |
| `MenuOverlayPlayful` | Fullscreen menu dialog with huge ruled links |
| `CarouselPlayful` | Slide carousel with arrows and an index + progress pager |
| `DateStripPlayful` | Single-select strip of days |
| `AudioPlayerPlayful` | Play/pause, seek slider and time |
| `ButtonSoft` | Pill button: `solid` (charcoal), `outline` (sand fill), `color` (`tone`); renders `<a>` with `href` |
| `IconButtonSoft` | Circular icon button (`aria-label` required); `size="lg"` is the FAB |
| `TextLinkSoft` | Text link without underline; always shows an arrow (default `→`) |
| `TagSoft` | Pill label with a `tone` |
| `ChipSoft` | Ink metadata pill |
| `ProjectCardSoft` | Rounded card with a `tone` header block and black-and-white media; the whole card is a link |
| `CardSoft` | Rounded charcoal content panel; a link with `href` |
| `StackCardSoft` | Rounded list card with a `tone` spine |
| `TopBarSoft` | Sand header bar with a rounded bottom |
| `FooterSoft` | Rounded charcoal footer |
| `BottomNavSoft` | Rounded charcoal bar; the current page is paper with a yellow dot |
| `TabsSoft` | Tonal segmented control |
| `MenuOverlaySoft` | Fullscreen menu dialog on a rounded sand sheet |
| `CarouselSoft` | Slide carousel with rounded slides and an index + progress pager |
| `DateStripSoft` | Single-select strip of rounded day tiles |
| `AudioPlayerSoft` | Charcoal player with the elapsed time as a big numeral |
| `ButtonSwiss` | Square button: `solid`, `outline`, accent `color`; `size="sm"` is a pill; renders `<a>` with `href` |
| `IconButtonSwiss` | Circular icon button, outlined by default (`aria-label` required); `size="lg"` is the FAB |
| `TextLinkSwiss` | Text link with a hover-only underline and optional arrow |
| `TagSwiss` | Sharp, outlined uppercase label |
| `ChipSwiss` | Sharp, outlined metadata chip |
| `ProjectCardSwiss` | Ruled card with a giant muted initial; the whole card is a link |
| `CardSwiss` | Hairline content panel; a link with `href` |
| `StackCardSwiss` | Ruled list card with a 2px accent spine |
| `TopBarSwiss` | Paper-white header made of hairline cells |
| `FooterSwiss` | Paper-white hairline grid footer |
| `BottomNavSwiss` | Hairline navigation bar; the current page gets an ink top rule |
| `TabsSwiss` | Tabs with an ink underline for the selected tab |
| `MenuOverlaySwiss` | Fullscreen paper-white menu with large muted links and hairline divisions |
| `CarouselSwiss` | Slide carousel with outlined arrows and a grotesk index + hairline progress pager |
| `DateStripSwiss` | Single-select strip of days with an ink selection underline |
| `AudioPlayerSwiss` | Audio player with a circular outlined play button, hairline track and square thumb |
| `Shape` | Circle, quarter, half, triangle, square, bar; `fill`: solid, outline, pattern; optional `spin` |
| `ShapeMosaic` | Edge-to-edge grid of shape tiles |
| `Stamp` | Circular rotating text badge |
| `Pattern` | Hatching, checker, grid paper, halftone, grain |
| `Ribbon` | Diagonal band of repeated text |
| `SkewBar` | Parallelogram bar with an optional flat offset shadow |
| `KineticRule` | Rule with a sliding dot |
| `Composition` | Grid of shapes and patterns placed by cell |

Animated decoration (`spin`, `KineticRule`, `Wordmark`) only runs when the user has not asked for reduced motion.

## Development

```sh
pnpm test          # unit tests
pnpm typecheck     # TypeScript
pnpm build         # library build to dist/
pnpm smoke         # builds, then checks a consumer Tailwind build sees every class
pnpm storybook     # component catalogue
```

## License

MIT
