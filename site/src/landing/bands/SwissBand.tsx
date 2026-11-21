import { DisplayHeading, QuoteBlock, RuledList, SectionLabel, TableSwiss, TabsSwiss } from "bauhaus-react";

const ROWS = [
  { id: "a", name: "Grid systems", pages: 42, status: "Published" },
  { id: "b", name: "Type as structure", pages: 28, status: "Published" },
  { id: "c", name: "Colour fields", pages: 17, status: "Draft" },
];

/** An editorial article, built only from Swiss components and look-agnostic primitives. */
export function SwissBand({ large }: { large: boolean }) {
  return (
    <section aria-label="Swiss" data-size={large ? "large" : "normal"} className="border-b border-bh-ink bg-bh-paper-white">
      <div className={`grid gap-10 px-4 md:grid-cols-12 md:px-8 ${large ? "py-20" : "py-10"}`}>
        <div className="md:col-span-7">
          <SectionLabel marker="A">Essay</SectionLabel>
          <DisplayHeading as="h3" size="xl" className="mt-4 font-bh-grotesk font-normal tracking-[-0.03em]">
            The grid is a promise to the reader
          </DisplayHeading>
          <p className="mt-6 max-w-xl font-bh-body text-bh-charcoal">
            A page ruled into cells tells you where to look before you read a word. Colour arrives as a field, type as structure,
            and nothing is there to decorate.
          </p>
          <QuoteBlock cite="Josef Müller-Brockmann" className="mt-8 font-bh-grotesk font-normal">
            The grid system is an aid, not a guarantee.
          </QuoteBlock>
        </div>
        <div className="flex flex-col gap-8 md:col-span-5">
          <RuledList
            items={[
              { content: "01 Grid" },
              { content: "02 Type", offset: 1 },
              { content: "03 Colour", offset: 2 },
              { content: "04 Reduction", offset: 3 },
            ]}
          />
          <TabsSwiss
            label="Article parts"
            items={[
              {
                id: "table",
                title: "Contents",
                content: (
                  <TableSwiss
                    aria-label="Article contents"
                    columns={[
                      { id: "name", label: "Chapter", isRowHeader: true },
                      { id: "pages", label: "Pages", align: "end" },
                      { id: "status", label: "Status" },
                    ]}
                    rows={ROWS}
                    getRowId={(row) => row.id}
                  />
                ),
              },
              { id: "notes", title: "Notes", content: <p className="py-4 text-bh-charcoal">Set in a single grotesk, one accent colour.</p> },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
