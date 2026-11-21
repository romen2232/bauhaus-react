import { Link } from "react-router";
import { CodeBlock } from "./CodeBlock";
import { H2, Page, P } from "./Prose";

const FONT_IMPORTS = `@import "@fontsource/outfit/300.css"; /* Soft look: light weights */
@import "@fontsource/outfit/400.css";
@import "@fontsource/outfit/700.css";
@import "@fontsource/outfit/800.css";
@import "@fontsource-variable/inter";
@import "@fontsource/inter-tight/400.css";`;

const OVERRIDE = `@theme {
  --color-bh-red: #e63b2e;
}`;

export function Theme() {
  return (
    <Page title="Theme & fonts" lead="Every design decision is a CSS variable, exposed as a Tailwind utility.">
      <H2>Fonts</H2>
      <P>
        The package does not bundle fonts. The theme expects Outfit (display), Inter (body) and Inter Tight (grotesk display,
        used by the Swiss look), and falls back to system sans-serif.
      </P>
      <CodeBlock code="pnpm add @fontsource/outfit @fontsource-variable/inter @fontsource/inter-tight" />
      <CodeBlock code={FONT_IMPORTS} label="CSS" />

      <H2>Tokens</H2>
      <P>
        Every token is a CSS variable prefixed <code>bh-</code>: <code>bg-bh-red</code>, <code>font-bh-display</code>,{" "}
        <code>shadow-bh-hard</code>, <code>animate-bh-spin</code>. To override one, redefine it after the import.
      </P>
      <CodeBlock code={OVERRIDE} label="CSS" />
      <P>
        Fill colours are red, yellow, blue, navy, sky, pink, orange, ink and paper. Components choose the text colour on each
        fill for WCAG AA contrast. Yellow is never used as a text colour. See the{" "}
        <Link to="/docs/colour" className="underline underline-offset-4">Colour page</Link> for every token.
      </P>

      <H2>Look-specific tokens</H2>
      <ul className="list-disc pl-5 text-bh-charcoal">
        <li><code>bh-sand</code>: a Soft surface colour (takes ink text).</li>
        <li><code>rounded-bh-soft</code>: the 20px radius of Soft panels.</li>
        <li><code>font-bh-grotesk</code>: Inter Tight, the Swiss look's type.</li>
        <li>
          <code>bh-accent</code>: the Swiss look's single accent, red by default. It fails AA for small text on white, so Swiss
          components use it only as a fill or a rule.
        </li>
      </ul>
    </Page>
  );
}
