# bauhaus-react

Bauhaus-style React components for **Tailwind CSS v4**: flat colour blocks, primitive shapes, hard shadows, giant geometric type.

The library mixes several Bauhaus-derived looks. Each look has its own components, and you mix looks by choosing which component to import:

| Look | Status | Suffix |
|---|---|---|
| Playful geometric | ✅ v0.1 | `*Playful` |
| Swiss editorial | planned | `*Swiss` |
| Warm soft | planned | `*Soft` |

Look-agnostic pieces (layout, type, decoration) have no suffix.

## Requirements

- React 19
- Tailwind CSS 4 in the consuming app

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

The package does not bundle fonts. The theme expects **Outfit** (display) and **Inter** (body), and falls back to system sans-serif:

```sh
pnpm add @fontsource/outfit @fontsource-variable/inter
```

```css
@import "@fontsource/outfit/700.css";
@import "@fontsource/outfit/800.css";
@import "@fontsource-variable/inter";
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

## Components

| Component | What it is |
|---|---|
| `Container` | Centered max-width wrapper with gutters |
| `Grid` | Layout grid; `ruled` shows 1px grid lines |
| `DisplayHeading` | Giant geometric heading; `echo` adds an offset copy |
| `HighlightText` | Muted paragraph; `HighlightText.Mark` stands out in ink |
| `ArrowLink` | Link with `→` or `↗` |
| `ButtonPlayful` | Pill button: `solid`, `outline`, `color`; renders `<a>` with `href` |
| `IconButtonPlayful` | Circular icon button (`aria-label` required) |
| `TagPlayful` | Solid colour label |
| `ProjectCardPlayful` | Colour card with giant initial; the whole card is a link |
| `TopBarPlayful` | Header made of ruled cells |
| `FooterPlayful` | Ruled grid footer |
| `Shape` | Circle, quarter, half, triangle, square, bar; optional `spin` |
| `ShapeMosaic` | Edge-to-edge grid of shape tiles |
| `Stamp` | Circular rotating text badge |

Animated decoration (`spin`) only runs when the user has not asked for reduced motion.

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
