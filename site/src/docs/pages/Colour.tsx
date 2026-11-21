import { HEX, RadioGroupSwiss, Shape, SOFT_HEX, SWISS_HEX, TEXT_ON } from "bauhaus-react";
import { useState } from "react";
import { H2, Page, P } from "./Prose";

const GROUNDS = [
  { name: "Paper", hex: HEX.paper },
  { name: "White", hex: SWISS_HEX.white },
  { name: "Ink", hex: HEX.ink },
  { name: "Blue", hex: HEX.blue },
] as const;

const SWATCHES = ["red", "yellow", "pink", "orange"] as const;
type Swatch = (typeof SWATCHES)[number];

const EXTRA = [
  { token: "bh-sand", hex: SOFT_HEX.sand, note: "Soft surface" },
  { token: "bh-charcoal", hex: SOFT_HEX.neutral, note: "Soft neutral" },
  { token: "bh-paper-white", hex: SWISS_HEX.white, note: "Swiss ground" },
  { token: "bh-rule", hex: SWISS_HEX.rule, note: "Hairlines" },
  { token: "bh-muted-text", hex: SWISS_HEX.mutedText, note: "Secondary text" },
] as const;

const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1);

export function Colour() {
  const [swatch, setSwatch] = useState<Swatch>("red");
  return (
    <Page title="Colour" lead="Colour is material, not decoration: a few saturated fields on generous neutral grounds.">
      <H2>Form and colour</H2>
      <P>
        Kandinsky linked the three basic forms to the three primaries: yellow with the triangle, red with the square, blue with
        the circle. It began as a classroom questionnaire and later studies found students often chose differently, so treat it as
        a convention, not a law. This site uses it on purpose, everywhere.
      </P>
      <div className="flex gap-6" aria-hidden="true">
        <div className="size-24"><Shape kind="triangle" color="yellow" /></div>
        <div className="size-24"><Shape kind="square" color="red" /></div>
        <div className="size-24"><Shape kind="circle" color="blue" /></div>
      </div>

      <H2>Colour is relative</H2>
      <P>
        Josef Albers showed that the grounds around a hue change how it looks. Judge a colour side by side, never alone. Below,
        the same swatch sits on four grounds.
      </P>
      <RadioGroupSwiss
        label="Swatch colour"
        orientation="horizontal"
        value={swatch}
        onChange={(v) => setSwatch(v as Swatch)}
        options={SWATCHES.map((s) => ({ value: s, label: cap(s) }))}
      />
      <div className="grid grid-cols-2 border border-bh-ink md:grid-cols-4">
        {GROUNDS.map((g) => (
          <div key={g.name} className="flex flex-col">
            <div data-testid="ground" data-ground={g.hex} style={{ backgroundColor: g.hex }} className="grid place-items-center p-8">
              <div data-testid="swatch" data-color={HEX[swatch]} style={{ backgroundColor: HEX[swatch] }} className="size-24" />
            </div>
            <p className="border-t border-bh-ink px-3 py-2 font-bh-mono text-xs uppercase tracking-[0.1em]">{g.name}</p>
          </div>
        ))}
      </div>

      <H2>Tokens</H2>
      <div className="overflow-x-auto">
        <table aria-label="Colour tokens" className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-bh-ink font-bh-mono text-xs uppercase tracking-[0.1em]">
              <th scope="col" className="py-2 pr-4">Token</th>
              <th scope="col" className="py-2 pr-4">Hex</th>
              <th scope="col" className="py-2 pr-4">Text on it</th>
              <th scope="col" className="py-2">Swatch</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(HEX) as (keyof typeof HEX)[]).map((key) => (
              <tr key={key} className="border-b border-bh-rule">
                <td className="py-2 pr-4 font-bh-mono">{`bh-${key}`}</td>
                <td className="py-2 pr-4 font-bh-mono">{HEX[key]}</td>
                <td className="py-2 pr-4">{TEXT_ON[key]}</td>
                <td className="py-2"><span aria-hidden="true" className="inline-block size-6 border border-bh-ink" style={{ backgroundColor: HEX[key] }} /></td>
              </tr>
            ))}
            {EXTRA.map((row) => (
              <tr key={row.token} className="border-b border-bh-rule">
                <td className="py-2 pr-4 font-bh-mono">{row.token}</td>
                <td className="py-2 pr-4 font-bh-mono">{row.hex}</td>
                <td className="py-2 pr-4">{row.note}</td>
                <td className="py-2"><span aria-hidden="true" className="inline-block size-6 border border-bh-ink" style={{ backgroundColor: row.hex }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
