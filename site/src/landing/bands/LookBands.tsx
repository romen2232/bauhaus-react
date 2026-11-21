import { useLook } from "../../look/LookContext";
import { PlayfulBand } from "./PlayfulBand";
import { SoftBand } from "./SoftBand";
import { SwissBand } from "./SwissBand";

/**
 * Mix: three stacked bands, one per look. A single look: that band alone, larger.
 * Soft is always its own rounded container, so no row mixes corner styles.
 */
export function LookBands() {
  const { look } = useLook();
  const large = look !== "mix";
  return (
    <div data-testid="look-bands" className="flex flex-col bg-bh-paper-white">
      {(look === "mix" || look === "playful") && <PlayfulBand large={large} />}
      {(look === "mix" || look === "swiss") && <SwissBand large={large} />}
      {(look === "mix" || look === "soft") && <SoftBand large={large} />}
    </div>
  );
}
