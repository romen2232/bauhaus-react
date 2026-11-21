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
| `TablePlayful` | Framed table with a yellow header and hard shadow |
| `TableSoft` | Tonal rows on a sand panel |
| `TableSwiss` | Hairline table with tabular numerals |
| `Shape` | Circle, quarter, half, triangle, square, bar; `fill`: solid, outline, pattern; optional `spin` |
| `ShapeMosaic` | Edge-to-edge grid of shape tiles |
| `Stamp` | Circular rotating text badge |
| `Pattern` | Hatching, checker, grid paper, halftone, grain |
| `Ribbon` | Diagonal band of repeated text |
| `SkewBar` | Parallelogram bar with an optional flat offset shadow |
| `KineticRule` | Rule with a sliding dot |
| `Composition` | Grid of shapes and patterns placed by cell |

Animated decoration (`spin`, `KineticRule`, `Wordmark`) only runs when the user has not asked for reduced motion.

### Forms

Six inputs in each look: `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup` and `Switch` (18 components).

| Component | What it is |
|---|---|
| `TextFieldPlayful` | Bordered paper-white text input; focus adds the hard shadow |
| `TextAreaPlayful` | Multi-line text input with the same bordered field |
| `SelectPlayful` | Button-triggered listbox with a bordered hard-shadow popover |
| `CheckboxPlayful` | Square checkbox; `color` sets the checked fill (default `ink`) |
| `RadioGroupPlayful` | Group of circular radios; `color` sets the checked fill (default `ink`) |
| `SwitchPlayful` | Square-track switch; `color` sets the checked fill (default `ink`) |
| `TextFieldSoft` | Pill text input on a sand fill with a 1px charcoal outline |
| `TextAreaSoft` | Rounded multi-line text input on sand with a 1px charcoal outline |
| `SelectSoft` | Pill trigger with a rounded sand popover |
| `CheckboxSoft` | Rounded checkbox; `tone` sets the checked fill (default `neutral`) |
| `RadioGroupSoft` | Group of round radios; `tone` sets the checked fill (default `neutral`) |
| `SwitchSoft` | Pill switch; `tone` sets the checked track (default `neutral`) |
| `TextFieldSwiss` | Transparent text input with a 1px ink bottom rule |
| `TextAreaSwiss` | Multi-line text input with a 1px ink bottom rule |
| `SelectSwiss` | Rule-style trigger with a paper-white hairline popover |
| `CheckboxSwiss` | Square outlined checkbox that fills with ink |
| `RadioGroupSwiss` | Group of outlined radios that fill with ink |
| `SwitchSwiss` | Outlined switch with an ink track when on |

Shared props:

- `label` (required): every field has a visible label. Use `hideLabel` to hide it visually; it stays the accessible name. There is no other way to drop the label.
- `description`: help text linked with `aria-describedby`. Known quirk: set it when the field mounts. React Aria resolves the description slot once on mount, so adding a `description` to an already mounted field does not link it.
- `errorMessage`: a node, or a function receiving React Aria's `ValidationResult`. It shows only while the field is invalid.
- `isRequired` adds the word "(required)" after the label in muted text. There is no red asterisk.
- `isInvalid`, `isDisabled`, `isReadOnly` (not on `Select`), `name`, `className`, `ref` (on the field root).
- Sizes: `md` only.
- Per component: `TextField` takes `type`, `value`/`defaultValue`/`onChange`, `placeholder`, `autoComplete`; `TextArea` adds `rows`; `Checkbox` and `Switch` take `isSelected`/`defaultSelected`/`onChange` (`Checkbox` also `isIndeterminate`); `RadioGroup` takes `options` (`{ value, label, isDisabled? }`), `value`/`defaultValue`/`onChange` and `orientation`; `Select` takes `items` (`{ id, label, isDisabled? }`), `selectedKey`/`defaultSelectedKey`/`onSelectionChange` and `placeholder`.
- Colour: Playful `color` and Soft `tone` set the checked fill of `Checkbox`, `RadioGroup` and `Switch`. Swiss has no colour prop.

Validation uses React Aria's native validation plus `validate` (return a message, an array of messages, or `true`/`null` for valid) and `errorMessage`. `validationBehavior` defaults to `"aria"`: errors are announced and shown while the user edits, with no browser tooltips. Pass `"native"` to defer to the browser on form submit. There is no form-state library.

Invalid state never uses small red text (red on paper is about 3.3:1). Invalid text fields and selects show the message in `ink` and mark the field with a red bar or, in Swiss, a `bh-accent` rule. `Checkbox`, `RadioGroup` and `Switch` do not change; the `ink` message sits under the control with a marker before it: a red square (Playful), a red tone dot (Soft) or a small accent square (Swiss).

`Select` shows a "No options" message in its popover when `items` is empty.

Soft fields and unchecked controls carry a 1px `charcoal` outline on the `sand` fill so the boundary reaches 3:1 non-text contrast (WCAG 1.4.11); the tonal fill alone is below that. Soft muted text is never placed on `sand`.

### Table

`TablePlayful`, `TableSoft` and `TableSwiss` render sortable data tables built on React Aria.

```tsx
import { TableSwiss, type TableColumn } from "bauhaus-react";

const columns: TableColumn<Row>[] = [
  { id: "name", label: "Name", isRowHeader: true, allowsSorting: true },
  { id: "total", label: "Total", align: "end", allowsSorting: true, sortValue: (r) => r.total },
];

<TableSwiss aria-label="Orders" columns={columns} rows={rows} getRowId={(r) => r.id} />
```

- `columns`, `rows` and `getRowId` are required, and so is `aria-label`.
- `TableColumn` fields: `render` (custom cell), `sortValue`, `align`, `isRowHeader` and `allowsSorting`.
- Sorting is controlled (`sortDescriptor` + `onSortChange`) or uncontrolled (`defaultSortDescriptor`). Missing values always sort last, and activating a sorted column toggles ascending/descending.
- Rows can link with `getRowHref` or act with `onRowAction`, not both.
- Wide tables scroll horizontally inside their wrapper.
- Status cells go through `render`, using `Tag`/`Chip` or plain text.

### Charts (0.7)

Four charts in each look: `BarChart`, `LineChart`, `DonutChart` and `Sparkline` (12 components). They are hand-drawn SVG with no extra dependency.

| Component | What it is |
|---|---|
| `BarChartPlayful` | Bars from `colors` with 2px ink outlines on an ink baseline |
| `LineChartPlayful` | Up to three coloured lines over an ink casing |
| `DonutChartPlayful` | Ring of coloured, ink-outlined slices with a centre numeral |
| `SparklinePlayful` | Ink trend line ending in a coloured dot (`color`) |
| `BarChartSoft` | Charcoal bars with one highlighted bar in a `tone` |
| `LineChartSoft` | Charcoal lines told apart by dash pattern, one toned point |
| `DonutChartSoft` | Charcoal-tint ring with one toned slice |
| `SparklineSoft` | Charcoal trend line ending in a toned dot |
| `BarChartSwiss` | Ink bars on 1px rule gridlines, one accent bar |
| `LineChartSwiss` | 1px ink, charcoal and muted lines on rule gridlines |
| `DonutChartSwiss` | Ink, charcoal and accent ring (at most 3 slices) |
| `SparklineSwiss` | 1px ink trend line ending in an accent dot |

Shared behaviour:

- Every chart is a `<figure>` with a required `title` (`hideTitle` hides it visually; it stays the accessible name), a visually hidden data table holding the same values, and an `aria-hidden` SVG with nothing focusable inside.
- Values come from the hover tooltip, the data table, or `showValues`. `Sparkline` has no tooltip or axes.
- `highlight` takes a label. Playful takes `colors`, Soft takes `tone`. A highlighted mark always prints its value.
- `DonutChart` draws at most 6 slices (Swiss 3) and groups the rest as "Other". `LineChart` takes up to 3 series through `series`, or one series through `data`.
- The chart fills its container's width, so give the parent a width. `height` sets the chart height.
- The types `ChartDatum` (`{ label, value }`) and `ChartSeries` (`{ id, label, data }`) are exported.
- Consumers must let Tailwind scan the package (the `@source` line in Setup) so the `fill-bh-*` and `stroke-bh-*` classes exist.

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
