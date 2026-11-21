import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { REGISTRY } from "./registry";
import { GROUPS } from "./registry/types";

const START = [
  { label: "Install", to: "/docs/getting-started/install" },
  { label: "Theme & fonts", to: "/docs/getting-started/theme" },
  { label: "Mixing looks", to: "/docs/getting-started/mixing-looks" },
  { label: "Principles", to: "/docs/principles" },
  { label: "Colour", to: "/docs/colour" },
];

const LINK =
  "block border-l-2 border-transparent py-1 pl-3 text-bh-muted-text hover:text-bh-ink aria-[current=page]:border-bh-red aria-[current=page]:font-bold aria-[current=page]:text-bh-ink";
const H2 = "mb-1 mt-5 font-bh-mono text-[11px] uppercase tracking-[0.1em] text-bh-ink";

/** Docs chrome: a sidebar of getting-started pages and component groups, and the page outlet. */
export function DocsLayout() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] md:grid-cols-[15rem_minmax(0,1fr)]">
      <aside className="border-b border-bh-rule md:border-b-0 md:border-r">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="docs-nav"
          onClick={() => setOpen((o) => !o)}
          className="w-full px-4 py-3 text-left font-bh-mono text-xs uppercase tracking-[0.1em] md:hidden"
        >
          Documentation menu
        </button>
        <nav
          id="docs-nav"
          aria-label="Documentation"
          className={`${open ? "block" : "hidden"} px-4 pb-6 font-bh-grotesk text-sm md:sticky md:top-16 md:block md:max-h-[calc(100vh-4rem)] md:overflow-y-auto`}
        >
          <h2 className={H2}>Get started</h2>
          <ul>
            {START.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={close} className={LINK}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {GROUPS.map((group) => (
            <div key={group}>
              <h2 className={H2}>{group}</h2>
              <ul>
                {REGISTRY.filter((e) => e.group === group)
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((e) => (
                    <li key={e.slug}>
                      <NavLink to={`/docs/components/${e.slug}`} onClick={close} className={LINK}>
                        {e.title}
                      </NavLink>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
