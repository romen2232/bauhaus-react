import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { PRINCIPLES } from "../landing/PrinciplesStrip";
import { useLook, type SingleLook } from "../look/LookContext";
import { LookRow, type RowSpec } from "./LookRow";
import { Playground } from "./Playground";
import { PropsTable, propsFor } from "./PropsTable";
import type { DocEntry, PlaygroundValues } from "./registry/types";

const SINGLE_LOOKS: readonly SingleLook[] = ["playful", "swiss", "soft"];
const LABEL: Record<SingleLook, string> = { playful: "Playful", swiss: "Swiss", soft: "Soft" };

const H2 = "font-bh-grotesk text-2xl tracking-[-0.02em] scroll-mt-24";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-4">
      <h2 id={`${id}-title`} className={H2}>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** One component's docs: look rows, playground, generated props, do/don't, accessibility. */
export function ComponentPage({ entry }: { entry: DocEntry }) {
  const { look } = useLook();
  const [values, setValues] = useState<PlaygroundValues>(() =>
    Object.fromEntries(entry.controls.map((c) => [c.prop, c.initial])),
  );

  const rows: RowSpec[] = entry.agnostic
    ? [
        {
          id: "preview",
          label: "Preview",
          look: null,
          exportNames: entry.agnostic.exportNames,
          snippet: entry.agnostic.snippet,
          demo: entry.agnostic.demo(values),
        },
      ]
    : SINGLE_LOOKS.flatMap((l) => {
        const demo = entry.looks?.[l];
        if (!demo || (look !== "mix" && look !== l)) return [];
        return [{ id: l, label: LABEL[l], look: l, exportNames: [demo.exportName], snippet: demo.snippet, demo: demo.demo(values) }];
      });
  const unavailable = !entry.agnostic && look !== "mix" && !entry.looks?.[look];
  const large = look !== "mix" && !entry.agnostic;

  // One props table per distinct set of docs: skins with identical props share a table.
  const tables = new Map<string, { names: string[]; docs: ReturnType<typeof propsFor> }>();
  for (const row of rows) {
    for (const name of row.exportNames) {
      const docs = propsFor(name);
      const key = JSON.stringify(docs);
      const hit = tables.get(key);
      if (hit) hit.names.push(name);
      else tables.set(key, { names: [name], docs });
    }
  }

  const toc = [
    ...rows.map((r) => ({ id: `row-${r.id}`, label: r.label })),
    ...(entry.controls.length > 0 ? [{ id: "playground", label: "Playground" }] : []),
    { id: "props", label: "Props" },
    ...(entry.dos.length + entry.donts.length > 0 ? [{ id: "do-dont", label: "Do / Don't" }] : []),
    ...(entry.a11y.length > 0 ? [{ id: "a11y", label: "Accessibility" }] : []),
  ];

  return (
    <div className="grid gap-10 px-4 py-8 md:px-8 xl:grid-cols-[minmax(0,1fr)_11rem]">
      <article className="flex min-w-0 flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="font-bh-display text-5xl font-extrabold tracking-[-0.03em] md:text-7xl">{entry.title}</h1>
          <p className="max-w-xl text-lg text-bh-charcoal">{entry.purpose}</p>
          <ul className="flex flex-wrap gap-2">
            {entry.principles.map((id) => {
              const p = PRINCIPLES.find((x) => x.id === id);
              return (
                <li key={id}>
                  <Link
                    to={`/docs/principles#${id}`}
                    title={p?.title}
                    className="border border-bh-ink px-2 py-0.5 font-bh-mono text-[11px] uppercase tracking-[0.1em] hover:bg-bh-ink hover:text-bh-paper"
                  >
                    {id.toUpperCase()}
                  </Link>
                </li>
              );
            })}
          </ul>
        </header>

        <div className="flex flex-col gap-6">
          {rows.map((row) => (
            <LookRow key={row.id} row={row} large={large} />
          ))}
          {unavailable && <p className="border border-bh-rule p-6 text-bh-muted-text">Not available in this look</p>}
        </div>

        {entry.controls.length > 0 && (
          <Section id="playground" title="Playground">
            <Playground controls={entry.controls} values={values} onChange={(prop, v) => setValues((prev) => ({ ...prev, [prop]: v }))} />
          </Section>
        )}

        <Section id="props" title="Props">
          <div className="flex flex-col gap-8">
            {[...tables.values()].map(({ names, docs }) => (
              <div key={names.join()} className="flex flex-col gap-2">
                <h3 className="font-bh-mono text-sm">{names.join(", ")}</h3>
                <PropsTable docs={docs} />
              </div>
            ))}
          </div>
        </Section>

        {entry.dos.length + entry.donts.length > 0 && (
          <Section id="do-dont" title="Do / Don't">
            <div className="grid gap-6 md:grid-cols-2">
              <ul className="flex flex-col gap-3 border-t-4 border-bh-ink pt-3">
                {entry.dos.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <ul className="flex flex-col gap-3 border-t-4 border-bh-red pt-3">
                {entry.donts.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </Section>
        )}

        {entry.a11y.length > 0 && (
          <Section id="a11y" title="Accessibility">
            <ul className="flex list-disc flex-col gap-2 pl-5 text-bh-charcoal">
              {entry.a11y.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </Section>
        )}
      </article>

      <nav aria-label="On this page" className="sticky top-24 hidden self-start font-bh-grotesk text-sm xl:block">
        <p className="mb-2 font-bh-mono text-xs uppercase tracking-[0.1em]">On this page</p>
        <ul className="flex flex-col gap-1.5 border-l border-bh-rule pl-3">
          {toc.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-bh-muted-text hover:text-bh-ink">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
