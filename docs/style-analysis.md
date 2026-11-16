# Bauhaus Style Analysis — Reference Breakdown

Source: `references/` (9 images + 3 videos: `Mobile.webm`, `BHause.mp4`, `OffMenu.mp4`).

Hex values were sampled from the images and rounded, so treat them as approximate starting points, not final tokens.

---

## 1. TL;DR — the style in one paragraph

A **grid-first, flat, geometric** system. Layouts are built from visible or implied **modular cells** (often separated by hairline rules). Each cell is either **typography**, **a flat colour block**, **a primitive shape** (circle, quarter-circle, semicircle, triangle, bar) or **a desaturated photo**. Colour is used **as a material, not as decoration**: big solid fields of a few saturated hues on a neutral ground (white, off-white or cream). Type is **sans-serif and geometric or grotesque**, set with extreme scale contrast (giant display vs tiny captions). There are **no gradients, no soft shadows and no skeuomorphism**. Hierarchy comes from **size, weight, colour fields and position in the grid**.

---

## 2. The references fall into 4 sub-styles (important)

The moodboard is NOT one style. It contains four related directions. A component library has to choose a **core** and treat the rest as **themes/variants**.

| # | Sub-style | References | Character |
|---|-----------|-----------|-----------|
| A | **Swiss / Editorial Minimal** | `BauhausConcept`, `Manifesto`, `aboutUs`, `OffMenu.mp4` | Monochrome, huge grotesk type, hairline grids, one primary accent at most |
| B | **Neo-Bauhaus Geometric (playful)** | `Modulo`, `Mijonju`, `Courageously-CraftedDesign` | Saturated flat colour blocks, quarter circles, pills, chunky display type |
| C | **Warm Soft Bauhaus (product UI)** | `BasicMobile`, `Mobile.webm`, `BHause.mp4` | Cream/beige ground, charcoal cards, red/yellow/blue as status accents, rounded corners |
| D | **Historical art sources** | `kandisnky` (Kandinsky, *Auf Weiss II*), `CJS` | Diagonals, primitives in tension, raw poster energy; this is inspiration, not UI |

> ⚠️ **`CJS.png` is not Bauhaus.** It is El Lissitzky's *Beat the Whites with the Red Wedge* (1919–20), **Russian Constructivism**. The two movements are related (Lissitzky influenced the Bauhaus, and Moholy-Nagy carried constructivist ideas into it), and they share the geometry. But Constructivism is more **diagonal, aggressive and propagandistic**, while Bauhaus is more **orthogonal and functional**. Keep it as a source for "dynamic diagonal" accents, not as the base.

---

## 3. Per-reference notes

### `aboutUs.png` — Swiss/Editorial (A)
- **Visible grid**: about 5 columns × 4 rows, divided by 1px light-grey lines (`#e5e5e5`-ish). The cells ARE the layout.
- Colour appears only as **rectangular fills inside cells**: blue `#1860f0` behind the building, red `#e8453c` in the lower-left cell, yellow `#f5b62a` as a small block at the bottom.
- B/W architectural photography, cut out and placed over the colour block.
- Display type: heavy geometric, all caps, condensed and wide-tracked ("BAUHAUS", "ARCHITECTURE & DESIGN").
- Micro UI: hamburger "MENU" label, "SEARCH" with icon, `01` index counter, thin progress bar (blue segment on grey track), small chevrons.
- **Component takeaways:** `GridFrame` with ruled cells, `ColorBlock`, `IndexCounter`, `ProgressRule`, `Carousel` with chevron pager.

### `BauhausConcept.png` — Swiss/Editorial (A)
- Pure black/white. Huge neo-grotesk (Inter/Helvetica-like) "Bauhaus" in **tight negative tracking**, with mixed weights in the headline.
- Words laid out on **horizontal rules**, like a staff ("REVOLUTIONARY / PURE / INNOVATIVE…") and offset across columns: **asymmetric, typographic composition**.
- Large years ("1915", "1919") as timeline markers.
- Circular portrait crop with **concentric outline circles** behind it.
- Grey-to-black text emphasis: a paragraph in light grey with **key words in black** (see `Manifesto`).
- **Takeaways:** `DisplayHeading`, `RuledList`, `Timeline`, `Avatar` with orbit rings, `EmphasisText`.

### `Manifesto.png` — Swiss/Editorial (A)
- **Signature pattern: "highlighted reading"**. Large text (~32–40px) in `#b5b5b5`, with key phrases in `#000`. It is a typographic, not chromatic, way to show emphasis.
- Link style: giant word plus a **north-east arrow** "Manifesto ↗".
- Brand columns (Ikea / Braun / Apple): tiny body text, grey product photography.
- Mobile header: wordmark centred, a hamburger inside a **bordered square cell** on the right, all separated by 1px rules.
- **Takeaways:** `HighlightText` (`<mark>`-like semantic), `ArrowLink`, `NavBar` with ruled cells.

### `Modulo.png` — Neo-Bauhaus Geometric (B)
- **Hero = tile mosaic**: a grid of squares where each tile holds **one primitive** (quarter-circle, semicircle, full arc) in navy `#1a2340`, sky blue `#00a8fc`, orange `#ffa800`, pink `#ff77a8`, white. Tiles rotate the primitive to make movement.
- **Pill bars** (stadium shapes) stacked as decoration.
- Display type: very heavy geometric sans ("SCHOOL"), with a **duplicated/offset echo** effect on "GRAPHIC DESIGN".
- Buttons: dark navy **pill** primary ("Apply now"), plus a text link with **thick underline** ("See the courses"). Nav links are underlined.
- **Takeaways:** `ShapeTile` / `PatternGrid` generator, `Pill`, `Button` (solid + underline-link variants), `EchoText`.

### `Mijonju.png` — Neo-Bauhaus Geometric (B), playful editorial
- Off-white ground `#f0ece4` with a faint **grid-paper texture**.
- Top bar split into **ruled columns** (logo | meta | version | index | menu pill).
- Category cards = **full-bleed colour columns** in pink `#e8789c`, yellow `#f5b424`, red-orange `#e84818`, blue `#0c84cc` and grey-beige. Each card has a **giant initial letter** (T, A, P, E, R), a label, short copy, an illustration, and a bottom-left arrow →.
- Small **tag labels** on cards ("NEW SCRIPT", "DAILY SKETCH", "WEBGL TOY") as solid colour badges.
- Outline button ("VIEW ALL"), circular arrow buttons for the carousel, a rotating **circular text stamp** ("OPEN SOURCE MINDSET").
- Sharp corners everywhere except circular buttons.
- **Takeaways:** `CategoryCard` (colour + drop-cap), `Tag`, `IconButton` (circle), `Stamp`, `TopBar` with ruled cells, `Footer` grid.

### `Courageously-CraftedDesign.png` — Neo-Bauhaus retro (B)
- **Mid-century palette, not primary**: deep teal `#0c3c54`, burnt orange `#f06030`, mustard `#e4b424`, khaki `#b4a890`, white.
- **Strong diagonal band** carrying rotated text: a constructivist gesture.
- **Offset hard shadows**: each orange/yellow bar has a second-colour copy offset behind it (no blur). It is the "Bauhaus shadow": a flat duplicate.
- Parallelogram/skewed bars as menu items ("explore / create / learn").
- Vertical stacked letterform logo inside a circle.
- **Takeaways:** `hard-shadow` token (offset, 0 blur, solid colour), `SkewBar`/`Ribbon`, rotated text utility.

### `BasicMobile.png` — Warm Soft (C)
- Palette: cream `#ede1d3`, charcoal `#464646`, coral red `#e45454`. Only three colours.
- **Circles**: large filled coral circles bleeding off the edges, plus **thin outline circles** overlapping them, and **halftone/wavy-line texture** circles.
- Cards: charcoal panels with **large radius (~20–24px)**, light text on dark.
- Type: geometric humanist sans (Futura / Jost-like), light and regular weights. Big numerals ("23", "07") in coral as a **data-display hero**, with faded next numbers ("24", "25") as a ghosted stepper.
- Thin horizontal rules under headers; long → arrows as the CTA.
- **Takeaways:** `BigNumber`/`NumberStepper`, `DecorCircle` (filled / outline / textured), `Card` (dark variant), `ArrowCTA`.

### `Mobile.webm` — Warm Soft (C), animated
- Light grey-cream ground on a dark stage. Cards with **large radius (~16–20px)** and subtle tonal fills, not shadows.
- **Primary triad as semantic colour**: yellow, red and blue tags mark the 3 tour stops (`#f2b233`, `#e02b20`, `#1f6fc4` approx.). Bauhaus colours **encode meaning**, they don't just decorate.
- Date strip: rounded tiles with weekday + big day number.
- Stacked cards with a **coloured spine/edge** on the right plus a `+` (the colour peeks out from behind the card).
- Room cards: colour header block (yellow/red) + B/W photo + round arrow button.
- Black **pill chips** for metadata ("August 2023", "Double Room", "1 Day"), plus a big black circular FAB with →.
- Vertical stepper (1–2–3 numbered coloured dots joined by a dashed line).
- Motion seen across frames: horizontal **carousel slide**, cards sliding/stacking, tap ripple. Movements are linear/ease-out and short; nothing bouncy.
- **Takeaways:** `Chip`, `DatePicker strip`, `Stepper/Timeline`, `StackCard`, `FAB`, `Tabs/BottomNav`.

### `BHause.mp4` — Warm Soft (C), animated hero (6s loop)
- Cream ground `#f7f1e6`, coral red `#e0474a`, sand yellow `#f5cf8a`, charcoal `#2b2b2e`. The stage behind the browser is also red.
- Hero split: text left, **geometric composition** right. The composition is a tall red rectangle, a circle split into cream and charcoal halves, small black squares, a sand square with **vertical hatch lines**, horizontal hatch blocks, quarter-circles at the corners, and thin diagonal lines.
- **Motion = the shapes ARE the animation**: the split circle **rotates** around its centre (like a clock hand), the small half-filled circles rotate too, and a **dot slides along a horizontal rule** that grows and shrinks. Everything loops slowly and linearly. This is "kinetic geometry", in the spirit of Hirschfeld-Mack's Bauhaus colour-light plays.
- CTA: small red **pill** button, uppercase label ("EXPLORE GALLERY").
- ⚠️ The headline ("The mind is like an umbrella…") is set in a **serif**, with an oversized faded quote mark. That breaks the sans-only rule. It is a stylistic choice in this reference, not core Bauhaus.
- **Takeaways:** `<Composition>` / `<KineticShape>` primitives (rotate, slide-on-rule), `Hatch` pattern (vertical/horizontal lines), `QuoteBlock`, `Button` pill size `sm`.

### `OffMenu.mp4` — Swiss / Editorial (A), animated site walkthrough (17s)
- Off-white `#f2f0eb` / white, ink black, with a deep oxblood red `#8c1c24` used only as a stage colour. Almost no accent colour inside the UI.
- **The wordmark is the layout**: "OFF" top-left and "MENU" top-right as giant grotesk words that act as logo AND menu trigger. They scale down to header size on scroll.
- Neo-grotesk (Neue Haas / Inter-like), **all caps headings**, regular weight (not bold). Big ≠ heavy.
- Strong **hairline rules** between sections. Three-column facts row: label → **big value** ("24H", "2 DAYS", "1 WEEK") → title → grey sub-list. This is the `BigNumber` pattern again, in Swiss form.
- **Fullscreen menu**: huge stacked uppercase links divided by rules. Inactive items are grey `#b5b5b5` and the hovered one is black (the same grey/black emphasis as `Manifesto`). Small "SOCIAL" list underneath.
- Monochrome 3D renders and B/W product shots; journal cards with abstract noisy images.
- Small black **pill** buttons ("GET STARTED"), labels with ↓ / ↗ arrows, section markers like "(P)", "(B)".
- Motion: page wipe/scale transitions, header shrink on scroll, menu text reveal. ⚠️ The menu overlay uses a **blurred backdrop**, which is a modern deviation from the flat rule.
- **Takeaways:** `Wordmark` that scales on scroll, `MenuOverlay` (stacked rule list, grey→ink hover), `StatColumns`, `SectionLabel` "(X)", `Button` pill `sm`.

### `kandisnky.png` — Art source (D)
- Kandinsky (Bauhaus master, 1922–33). Colour theory: **yellow ↔ triangle, red ↔ square, blue ↔ circle** (his 1923 Bauhaus questionnaire). This is a strong, historically grounded rule to use for shape+colour pairing.
- Off-white ground; sharp diagonals; checkerboards; thin parallel line sets.
- Poster frame: **lowercase geometric sans** ("bauhaus archiv"), the Herbert Bayer *Universal* style. Bauhaus typography favoured **lowercase-only** text.
- **Takeaways:** shape-colour mapping for decorative props, `Checker` pattern, parallel-line pattern.

### `CJS.png` — Art source (D), Constructivism
- Red / black / off-white `#f7f0ea` only. A diagonal split of the ground, a wedge piercing a circle, speckled print texture, tilted hand-drawn type.
- **Takeaways:** at most a `diagonal` composition variant and a `grain` texture utility. Do not use it as the base language.

---

## 4. Extracted design principles (what makes it "Bauhaus" on the web)

1. **Form follows function.** Every decorative shape still sits on the grid and frames content. Ornament is structural.
2. **The grid is visible.** Hairline rules (1px) divide header, nav and content into cells (`aboutUs`, `Manifesto`, `Mijonju`).
3. **Primitives only**: circle, square, triangle, plus their fragments (quarter-circle, semicircle, bar/pill, wedge).
4. **Flat colour as material.** Large solid fields; no gradients, no glows, no blurred shadows. Depth = overlap + offset.
5. **Limited palette.** Primary triad (red, yellow, blue) + black + a neutral ground. One screen usually uses **1 accent strongly + 1–2 supporting accents**.
6. **Asymmetric balance.** Content is offset, not centred; tension comes from scale and position.
7. **Typographic hierarchy by scale contrast.** Display type is 6–12× body size. Weight and colour (grey vs black) carry emphasis.
8. **Sans-serif only.** Geometric (Futura, Bayer Universal) or neo-grotesk (Helvetica, Inter). Uppercase for labels, optional lowercase-only headlines.
9. **Photography is B/W or desaturated**, often cut out and placed over a colour block.
10. **Colour carries meaning** in product UI (status, category, step).
11. **Directional arrows** (→, ↗) are a recurring CTA and navigation device.
12. **Numbers as heroes**: indices (`01`), years, counts in giant type.

---

## 5. Proposed design tokens (draft)

### 5.1 Colour

```txt
// Neutrals
paper        #F4EFE6   (cream ground — BasicMobile/Mijonju/Kandinsky)
paper-white  #FFFFFF   (Swiss variant)
ink          #111111   (text / black blocks)
charcoal     #464646   (dark cards — BasicMobile)
rule         #E5E5E5   (hairline grid lines)
muted        #B5B5B5   (de-emphasised text — Manifesto)

// Primary triad (core)
red          #E1352B   (range seen: #E02B20 – #E45454)
yellow       #F5B62A   (range seen: #E4B424 – #FFA800)
blue         #1F5FD8   (range seen: #1860F0 – #1F6FC4 – #0C84CC)

// Extended (theme-level, from Modulo / Mijonju / Courageously)
navy         #1A2340
sky          #00A8FC
pink         #FF77A8
orange       #F06030
teal         #0C3C54
khaki        #B4A890
```

Recommendation: ship **`classic`** (paper + triad + ink) as the default theme, with **`swiss`** (white + ink + a single accent) and **`playful`** (Modulo/Mijonju extended palette) as alternate themes.

⚠️ Accessibility: yellow on white/cream fails WCAG contrast for text. Yellow is a **fill colour with ink text on top**, never a text colour. Check red and blue as text colours too.

### 5.2 Typography

| Role | Candidate fonts (free) | Notes |
|------|------------------------|-------|
| Display geometric | **Jost** (Futura-like), **League Spartan**, **Outfit** | Bauhaus-authentic geometry |
| Display grotesk | **Inter Display**, **Inter Tight**, **Archivo** | Swiss variant, tight tracking (-0.03 to -0.05em) |
| Bauhaus display ornament | **Bauhaus 93**-like (use sparingly), **Syncopate** | `aboutUs`/`Manifesto` wordmarks only |
| Body | **Inter** / **Jost** | 14–16px |
| Mono / labels | **JetBrains Mono** or **Space Mono** | Indices, metadata (optional) |

Scale (ratio about 1.333 with jumps for display): `12, 14, 16, 20, 24, 32, 48, 72, 96, 144`.
Labels: uppercase, letter-spacing `0.08–0.12em`, 11–12px.

### 5.3 Shape / radius — ⚠️ DECISION NEEDED

The references split:
- **Sharp (0px)**: `aboutUs`, `Mijonju`, `Manifesto`, `Courageously`, the art pieces.
- **Rounded (16–24px)**: `BasicMobile`, `Mobile.webm`, Modulo browser frame.
- **Full (pill/circle)**: buttons and chips in Modulo, Mobile.webm, Mijonju.

The historically accurate choice is **sharp rectangles + perfect circles/pills** (radius is either 0 or 9999, rarely in between). Mid radii are a modern softening. Suggestion: a `radius` token per theme (`0` for classic/swiss, `20px` for soft).

### 5.4 Borders, elevation, motion

- `border-hairline: 1px solid rule`, `border-strong: 2–3px solid ink` (outline buttons, Mijonju).
- **Elevation = hard offset shadow**: `4px 4px 0 0 <ink|accent>`; never blurred.
- Motion has two layers:
  - **UI motion**: short (150–250ms), `ease-out`; slide, wipe, reveal, header shrink. No spring or bounce.
  - **Kinetic decoration** (`BHause.mp4`): slow (4–8s) linear loops where primitives rotate around their centre or slide along a rule. It lives only in decorative components.
  - Both respect `prefers-reduced-motion`; kinetic loops stop completely.

### 5.5 Spacing and grid

- 8px base unit. Layouts on a 12-col grid with **visible ruled cells** as an opt-in (`<Grid ruled>`).
- Generous gutters in the Swiss variant; dense mosaics in the playful variant (gap 0, so tiles touch).

---

## 6. Component inventory seen in references

| Component | Seen in | Notes |
|-----------|---------|-------|
| Button: solid (pill / rect) | Modulo, Mobile | ink fill, light text |
| Button: outline | Mijonju | 1–2px ink border, sharp |
| Button: icon-circle / FAB | Mijonju, Mobile, BasicMobile | arrow icon |
| ArrowLink (→ / ↗) | Manifesto, Mijonju, BasicMobile | big variant for hero CTA |
| Underline link (thick) | Modulo | 2px offset underline |
| Tag / Badge (solid colour) | Mijonju, Mobile | uppercase micro text |
| Chip (black pill) | Mobile | metadata |
| Card: colour column + drop-cap | Mijonju | category |
| Card: dark panel | BasicMobile | reading/content |
| Card: stack with colour edge | Mobile | list items |
| NavBar / TopBar with ruled cells | aboutUs, Manifesto, Mijonju | |
| BottomNav | Mobile | icon-only |
| Carousel + pager / progress rule | aboutUs, Mijonju, Mobile | |
| Date strip | Mobile | |
| Stepper / Timeline (numbered dots) | Mobile, BauhausConcept | triad-coded |
| BigNumber / ghost stepper | BasicMobile | |
| HighlightText (grey + black) | Manifesto, BauhausConcept | |
| DisplayHeading / EchoText | BauhausConcept, Modulo | |
| Avatar (circle + orbit rings) | BauhausConcept, BasicMobile | |
| Media: B/W image on colour block | aboutUs, Mobile | |
| Decor: ShapeTile / PatternGrid | Modulo | quarter-circles, rotations |
| Decor: Circle (fill/outline/texture) | BasicMobile | |
| Decor: Stamp (circular text) | Mijonju | |
| Decor: Ribbon / diagonal band | Courageously, CJS | |
| Audio player / progress | BasicMobile | |

---

## 7. Anti-patterns (what breaks the style)

- Gradients, glassmorphism, blurred drop shadows, neumorphism.
- Serif or script fonts (Mijonju's handwritten note and BHause's serif headline are deliberate exceptions, not the rule).
- Backdrop blur (OffMenu's menu uses it; prefer a solid paper overlay).
- Mid-tone pastel-everything palettes without an anchoring ink/black.
- Mid radii mixed with sharp corners in the same view.
- Centred, symmetrical "hero + subtitle + button" layouts with no grid tension.
- Decorative shapes that ignore the grid.
- Colour used without meaning in functional UI.

---

## 8. Open items

1. **Core direction**: which sub-style (A, B or C) is the default theme?
2. **Radius policy**: sharp + circle (historical) vs soft rounded (modern product)?
3. **Font licensing**: pick the free alternatives (Jost / Inter) or a licensed Futura/Neue Haas?
4. **Kinetic decoration**: ship animated shape primitives in v1, or keep them static?
