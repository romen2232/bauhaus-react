import { ButtonPlayful, ButtonSoft, ButtonSwiss } from "bauhaus-react";
import { CodeBlock } from "./CodeBlock";
import { H2, Page, P } from "./Prose";

const EXAMPLE = `<section>
  <ButtonPlayful>Playful</ButtonPlayful>
  <ButtonSwiss>Swiss</ButtonSwiss>
</section>

{/* Soft gets its own rounded container */}
<section className="rounded-bh-soft bg-bh-sand p-6">
  <ButtonSoft>Soft</ButtonSoft>
</section>`;

export function MixingLooks() {
  return (
    <Page title="Mixing looks" lead="Looks are chosen per component, by the import. Mix them freely, with one rule.">
      <H2>How mixing works</H2>
      <P>
        Each look has its own components, with a suffix: ButtonPlayful, ButtonSwiss, ButtonSoft. Look-agnostic pieces (layout,
        type and decoration) have no suffix and work with every look.
      </P>

      <H2>The corner rule</H2>
      <P>
        Use one corner style per row. Playful and Swiss share sharp corners and circles, so they sit together happily. Soft uses
        the 20px radius, so give it its own container. Never put a Soft component and a sharp one side by side in the same row.
      </P>

      <div className="grid gap-4">
        <div>
          <p className="mb-1 font-bh-mono text-xs uppercase tracking-[0.1em]">Do: sharp looks share a row</p>
          <div data-testid="sharp-example" className="flex flex-wrap items-center gap-4 border border-bh-ink bg-bh-paper p-6">
            <ButtonPlayful>Playful</ButtonPlayful>
            <ButtonSwiss>Swiss</ButtonSwiss>
          </div>
        </div>
        <div>
          <p className="mb-1 font-bh-mono text-xs uppercase tracking-[0.1em]">Do: Soft in its own container</p>
          <div data-testid="soft-example" className="flex flex-wrap items-center gap-4 rounded-bh-soft bg-bh-sand p-6">
            <ButtonSoft>Soft</ButtonSoft>
            <ButtonSoft variant="outline">Also Soft</ButtonSoft>
          </div>
        </div>
      </div>
      <CodeBlock code={EXAMPLE} label="TSX" />

      <H2>Pairings that work</H2>
      <ul className="list-disc pl-5 text-bh-charcoal">
        <li>Swiss for structure and type, Playful for the hero and calls to action.</li>
        <li>Soft for data and forms, set in its own section of the page.</li>
        <li>Decoration (shapes, mosaics) with any look, in the colours its shape asks for.</li>
      </ul>
    </Page>
  );
}
