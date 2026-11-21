import { Link } from "react-router";
import { LookBands } from "./bands/LookBands";
import { Hero } from "./hero/Hero";
import { InstallSteps } from "./InstallSteps";
import { MosaicBand } from "./mosaic/MosaicBand";
import { PrinciplesStrip } from "./PrinciplesStrip";

export function LandingPage() {
  return (
    <>
      <Hero />
      <MosaicBand />
      <LookBands />
      <PrinciplesStrip />
      <InstallSteps />
      <div className="border-t border-bh-ink bg-bh-ink px-4 py-12 text-center md:px-8">
        <Link to="/docs/getting-started/install" className="font-bh-grotesk text-4xl tracking-[-0.03em] text-bh-paper underline underline-offset-8 md:text-6xl">
          Read the docs
        </Link>
      </div>
    </>
  );
}
