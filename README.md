# bauhaus-react

Bauhaus-style React components for **Tailwind CSS v4**: flat colour blocks, primitive shapes, hard shadows, giant geometric type.

The library mixes several Bauhaus-derived looks. Each look has its own components, and you mix looks by choosing which component to import:

| Look | Status | Suffix |
|---|---|---|
| Playful geometric | ✅ v0.2 | `*Playful` |
| Swiss editorial | planned | `*Swiss` |
| Warm soft | planned | `*Soft` |

Look-agnostic pieces (layout, type, decoration) have no suffix.

## Requirements

- React 19
- Tailwind CSS 4 in the consuming app

Interactive widgets (`TabsPlayful`, `MenuOverlayPlayful`, `DateStripPlayful`, `AudioPlayerPlayful`) are built on [React Aria Components](https://react-spectrum.adobe.com/react-aria/) and use `@internationalized/date` for dates. Both install automatically as dependencies. These components are marked `"use client"`; everything else is server-component safe.

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

The package does not bundle fonts. The theme expects **Outfit** (display), **Inter** (body) and **Inter Tight** (grotesk display, used by `Wordmark` and the upcoming Swiss look), and falls back to system sans-serif:

```sh
pnpm add @fontsource/outfit @fontsource-variable/inter @fontsource/inter-tight
```

```css
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

- `bh-sand`: a surface colour for the upcoming Soft look.
- `bh-accent` (red by default): the Swiss look's single accent. Use it for fills, rules and text of 24px or larger only. It fails AA contrast for small text.
- `rounded-bh-soft` (20px): a radius for Soft panels.
- `font-bh-grotesk`: Inter Tight.
- `animate-bh-slide` and `animate-bh-grow`: kinetic decoration loops.

Hard shadows take any colour: `shadow-bh-hard shadow-bh-red`.

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
