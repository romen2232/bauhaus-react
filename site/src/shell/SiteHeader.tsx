import { Link } from "react-router";
import { LookSelect } from "./LookSelect";
import { TileMark } from "./TileMark";

const NAV = [
  { label: "Docs", to: "/docs/getting-started/install" },
  { label: "Colour", to: "/docs/colour" },
] as const;

const LINK = "font-bh-grotesk text-bh-muted-text hover:text-bh-ink motion-safe:transition-colors";

/** Site chrome. Always Swiss: hairline rule, ink on white. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center gap-x-8 gap-y-2 border-b border-bh-ink bg-bh-paper-white px-4 py-3 md:px-8">
      <Link to="/" className="flex items-center gap-2 font-bh-display text-lg font-extrabold tracking-[-0.02em]">
        <TileMark size={28} />
        bauhaus-react
      </Link>
      <nav aria-label="Main" className="flex items-center gap-6">
        {NAV.map((item) => (
          <Link key={item.to} to={item.to} className={LINK}>
            {item.label}
          </Link>
        ))}
        <a href="https://github.com/romen2232/bauhaus-react" className={LINK}>
          GitHub
        </a>
      </nav>
      <div className="ml-auto">
        <LookSelect />
      </div>
    </header>
  );
}
