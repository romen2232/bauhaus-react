import { useEffect, useRef, useState } from "react";
import { DisplayHeading, createToastQueue } from "bauhaus-react";
import { LOOKS, useLook, type SingleLook } from "../../look/LookContext";
import { useReducedMotion } from "../../look/useReducedMotion";
import { HERO_KIT, heroLook } from "./heroKit";
import { ShapeWipe, WIPE_MS, type WipeKind } from "./ShapeWipe";

const INSTALL = "pnpm add bauhaus-react";
const CYCLE: readonly SingleLook[] = LOOKS.filter((l): l is SingleLook => l !== "mix");
const WIPE_KINDS: readonly WipeKind[] = ["circle", "square", "triangle"];
const VISITS = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 15 },
  { label: "Thu", value: 26 },
  { label: "Fri", value: 22 },
  { label: "Sat", value: 34 },
  { label: "Sun", value: 31 },
];

const PANEL: Record<SingleLook, string> = {
  playful: "bg-bh-blue",
  swiss: "border border-bh-ink bg-bh-paper-white",
  soft: "rounded-bh-soft bg-bh-sand",
};
// Chart marks are drawn for light grounds: Soft's default charcoal card would hide the sparkline.
const STAT_CARD: Record<SingleLook, string> = { playful: "", swiss: "", soft: "bg-bh-paper text-bh-ink" };
const CODE: Record<SingleLook, string> = {
  playful: "border-2 border-bh-ink bg-bh-paper-white",
  swiss: "border border-bh-ink bg-bh-paper-white",
  soft: "rounded-bh-soft bg-bh-charcoal text-bh-paper",
};

const label = (look: SingleLook) => look[0]!.toUpperCase() + look.slice(1);

/** Landing hero: giant type on one side, a live mini-app that re-skins with the selected look on the other. */
export function Hero() {
  const { look, setLook } = useLook();
  const reduced = useReducedMotion();
  const target = heroLook(look);
  const [shown, setShown] = useState<SingleLook>(target);
  const [wipe, setWipe] = useState<{ kind: WipeKind; to: SingleLook } | null>(null);
  const [copied, setCopied] = useState(false);
  const [queue] = useState(() => createToastQueue());
  const shownRef = useRef(shown);
  const wipes = useRef(0);

  useEffect(() => {
    shownRef.current = shown;
  }, [shown]);

  useEffect(() => {
    if (target === shownRef.current) return;
    if (reduced) {
      setShown(target);
      return;
    }
    setWipe({ kind: WIPE_KINDS[wipes.current++ % WIPE_KINDS.length]!, to: target });
    const swap = setTimeout(() => setShown(target), WIPE_MS / 2);
    const clear = setTimeout(() => setWipe(null), WIPE_MS + 150);
    return () => {
      clearTimeout(swap);
      clearTimeout(clear);
    };
  }, [target, reduced]);

  useEffect(() => {
    queue({ title: `${label(shown)} look`, description: "Same components, new skin.", timeout: 2500, color: "yellow", tone: "yellow" });
  }, [queue, shown]);

  const kit = HERO_KIT[shown];
  const cycleNext = () => setLook(CYCLE[(CYCLE.indexOf(target) + 1) % CYCLE.length]!);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked: the command stays selectable on the page.
    }
  };

  return (
    <section aria-label="Introduction" className="grid items-center gap-10 bg-bh-paper px-4 py-10 md:grid-cols-2 md:px-8 md:py-16">
      <div className="flex min-w-0 flex-col items-start gap-6">
        <DisplayHeading as="h1" size="2xl" className="break-words">
          <span className="block">One idea.</span> <span className="block text-bh-red">Three looks.</span>
        </DisplayHeading>
        <p className="max-w-md font-bh-body text-lg text-bh-charcoal">
          Bauhaus components for React and Tailwind. Flat colour, primitive shapes, hard geometry. Pick a look, or mix them.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <kit.Button onClick={cycleNext}>Try it</kit.Button>
          <span className={`flex items-center gap-3 px-4 py-2 font-bh-mono text-sm ${CODE[shown]}`}>
            <code>{INSTALL}</code>
            <button type="button" onClick={copy} aria-label="Copy install command" className="underline underline-offset-4">
              {copied ? "Copied" : "Copy"}
            </button>
          </span>
        </div>
      </div>

      <div data-testid="hero-app" data-look={shown} className={`relative min-w-0 overflow-hidden p-6 md:p-8 ${PANEL[shown]}`}>
        <div className="flex flex-col gap-5">
          <kit.Card header="Visits this week" className={STAT_CARD[shown]}>
            <p className="font-bh-display text-4xl font-bold">2,376</p>
            <kit.Sparkline title="Visits per day" hideTitle data={VISITS} className="w-full" />
          </kit.Card>
          <kit.Card>
            <kit.AudioPlayer src={`${import.meta.env.BASE_URL}silence.wav`} title="Demo track" />
          </kit.Card>
        </div>
        <kit.ToastRegion queue={queue} placement="bottom" className="absolute" />
        {wipe && <ShapeWipe kind={wipe.kind} onDone={() => { setShown(wipe.to); setWipe(null); }} />}
      </div>
    </section>
  );
}
