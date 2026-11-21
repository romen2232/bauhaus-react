import { Link } from "react-router";

/** Titles mirror the `### P<n>.` headings of docs/bauhaus-principles.md. */
export const PRINCIPLES = [
  { id: "p1", title: "Unity of the arts, crafts and building" },
  { id: "p2", title: "Art and technology, made for use" },
  { id: "p3", title: "Learn by doing" },
  { id: "p4", title: "Elementary forms: circle, square, triangle" },
  { id: "p5", title: "Colour as material, with a limited palette" },
  { id: "p6", title: "Typography as structure" },
  { id: "p7", title: "Typophoto: word and image as one" },
  { id: "p8", title: "Asymmetric, rationally ordered composition" },
  { id: "p9", title: "Reduction: no applied ornament" },
  { id: "p10", title: "Community and the end of class barriers" },
  { id: "p11", title: "Experiment and kinetic form" },
] as const;

export function PrinciplesStrip() {
  return (
    <section aria-label="Principles" className="border-t border-bh-ink bg-bh-paper-white px-4 py-12 md:px-8">
      <h2 className="font-bh-grotesk text-4xl tracking-[-0.03em] md:text-6xl">Eleven principles, one system</h2>
      <p className="mt-3 max-w-xl text-bh-charcoal">
        The library is built on what the Bauhaus actually taught. Each card opens the research behind it.
      </p>
      <ul className="mt-8 grid grid-cols-2 border-l border-t border-bh-ink md:grid-cols-4">
        {PRINCIPLES.map((p, i) => (
          <li key={p.id} className="border-b border-r border-bh-ink">
            <Link
              to={`/docs/principles#${p.id}`}
              className="flex h-full min-h-32 flex-col justify-between gap-6 p-4 hover:bg-bh-paper focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-bh-ink"
            >
              <span className="font-bh-mono text-xs uppercase tracking-[0.1em]">P{i + 1}</span>
              <span className="font-bh-grotesk text-lg leading-tight">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
