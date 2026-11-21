import { ButtonPlayful, Composition, ProjectCardPlayful, Shape, TagPlayful, TopBarPlayful } from "bauhaus-react";

const stay = (e: { preventDefault(): void }) => e.preventDefault();

/** A studio portfolio, built only from Playful components. Sharp corners and circles. */
export function PlayfulBand({ large }: { large: boolean }) {
  return (
    <section aria-label="Playful" data-size={large ? "large" : "normal"} className="overflow-hidden border-b-2 border-bh-ink bg-bh-paper">
      <TopBarPlayful
        brand="Studio Modulo"
        meta={["Portfolio", "Est. 2019", "Open for projects"]}
        action={<ButtonPlayful size="sm">Contact</ButtonPlayful>}
      />
      <div className={`grid gap-8 px-4 md:grid-cols-[1.2fr_1fr] md:px-8 ${large ? "py-20" : "py-10"}`}>
        <div className="flex flex-col gap-6">
          <TagPlayful color="yellow">Selected work</TagPlayful>
          <h3 className="font-bh-display text-5xl font-extrabold uppercase leading-[0.9] tracking-[-0.03em] md:text-7xl">
            Shapes that carry a brand
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProjectCardPlayful href="#" onClick={stay} initial="M" title="Modulo" description="Identity for a modular furniture maker." color="red" tag={{ label: "Brand" }} headingLevel={3} />
            <ProjectCardPlayful href="#" onClick={stay} initial="O" title="OffMenu" description="A booking app for pop-up kitchens." color="blue" tag={{ label: "Product" }} headingLevel={3} />
          </div>
        </div>
        <Composition
          cols={3}
          rows={3}
          className="aspect-square w-full border-2 border-bh-ink"
          cells={[
            { col: 1, row: 1, colSpan: 2, rowSpan: 2, node: <Shape kind="circle" color="blue" /> },
            { col: 3, row: 1, node: <Shape kind="square" color="red" /> },
            { col: 3, row: 2, node: <Shape kind="triangle" color="yellow" /> },
            { col: 1, row: 3, node: <Shape kind="quarter" color="ink" /> },
            { col: 2, row: 3, colSpan: 2, node: <Shape kind="bar" color="ink" /> },
          ]}
        />
      </div>
    </section>
  );
}
