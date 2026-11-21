import { Outlet } from "react-router";
import { LookProvider } from "../look/LookContext";
import { SiteHeader } from "./SiteHeader";

/** Root layout: look state, header, page outlet, footer. */
export function SiteLayout() {
  return (
    <LookProvider>
      <div className="flex min-h-screen flex-col bg-bh-paper-white text-bh-ink">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t border-bh-rule px-4 py-6 font-bh-grotesk text-sm text-bh-muted-text md:px-8">
          bauhaus-react · MIT licensed
        </footer>
      </div>
    </LookProvider>
  );
}
