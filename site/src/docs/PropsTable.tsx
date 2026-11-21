import type { PropDoc } from "../../scripts/extract-props.ts";
import propsJson from "../generated/props.json";

const PROPS = propsJson as unknown as Record<string, PropDoc[]>;

export function propsFor(exportName: string): PropDoc[] {
  return PROPS[exportName] ?? [];
}

/** Props generated from the library's TypeScript types at build time. Inherited DOM props are one line. */
export function PropsTable({ docs }: { docs: PropDoc[] }) {
  const own = docs.filter((d): d is Extract<PropDoc, { inherited: false }> => !d.inherited);
  const inherited = docs.find((d): d is Extract<PropDoc, { inherited: true }> => d.inherited);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left font-bh-body text-sm">
        <thead>
          <tr className="border-b border-bh-ink font-bh-mono text-xs uppercase tracking-[0.1em]">
            <th scope="col" className="py-2 pr-4">Prop</th>
            <th scope="col" className="py-2 pr-4">Type</th>
            <th scope="col" className="py-2 pr-4">Default</th>
            <th scope="col" className="py-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {own.map((d) => (
            <tr key={d.name} className="border-b border-bh-rule align-top">
              <td className="py-2 pr-4 font-bh-mono">{d.name}</td>
              <td className="max-w-xs break-words py-2 pr-4 font-bh-mono text-xs text-bh-charcoal">{d.type}</td>
              <td className="py-2 pr-4 font-bh-mono text-xs">{d.defaultValue ?? "—"}</td>
              <td className="py-2 text-bh-charcoal">
                {d.required && <span className="mr-2 font-bh-mono text-xs uppercase">required</span>}
                {d.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {inherited && (
        <p className="mt-3 text-sm text-bh-muted-text">
          Inherits {inherited.count} DOM props from the underlying element.
        </p>
      )}
    </div>
  );
}
