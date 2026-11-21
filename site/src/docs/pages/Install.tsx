import { Link } from "react-router";
import { CodeBlock } from "./CodeBlock";
import { H2, Page, P } from "./Prose";

const CSS = `@import "tailwindcss";
@import "bauhaus-react/theme.css";
@source "../node_modules/bauhaus-react/dist";`;

const USAGE = `import { ButtonPlayful, DisplayHeading, ProjectCardPlayful, Grid } from "bauhaus-react";

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
}`;

export function Install() {
  return (
    <Page title="Install" lead="bauhaus-react is a set of React components for Tailwind CSS v4. Three looks, one import.">
      <H2>Requirements</H2>
      <ul className="list-disc pl-5 text-bh-charcoal">
        <li>React 19</li>
        <li>Tailwind CSS 4 in your app</li>
      </ul>
      <P>
        Interactive widgets (tabs, menus, date strips, the audio player) are built on React Aria Components and install
        automatically. They are marked <code>"use client"</code>; everything else is safe in server components.
      </P>

      <H2>1. Add the package</H2>
      <CodeBlock code="pnpm add bauhaus-react" />

      <H2>2. Add the theme</H2>
      <P>In your main CSS file, import the theme and tell Tailwind to scan the package. Adjust the @source path so it is relative to your CSS file.</P>
      <CodeBlock code={CSS} label="CSS" />

      <H2>3. Use a component</H2>
      <P>Each look has its own components. You mix looks by choosing which one you import: ButtonPlayful, ButtonSwiss or ButtonSoft.</P>
      <CodeBlock code={USAGE} label="TSX" />
      <P>
        Every component accepts <code>className</code>, and your classes win over the component's own, including bh-* tokens.
      </P>

      <P>
        Next: <Link to="/docs/getting-started/theme" className="underline underline-offset-4">Theme &amp; fonts</Link>.
      </P>
    </Page>
  );
}
