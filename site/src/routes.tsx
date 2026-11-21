import type { RouteObject } from "react-router";
import { NotFound } from "./pages/NotFound";
import { SiteLayout } from "./shell/SiteLayout";

function Placeholder({ name }: { name: string }) {
  return <h1 className="px-4 py-16 text-4xl md:px-8">{name}</h1>;
}

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <SiteLayout />,
    children: [
      { index: true, element: <Placeholder name="Landing" /> },
      { path: "docs/getting-started/:page", element: <Placeholder name="Getting started" /> },
      { path: "docs/principles", element: <Placeholder name="Principles" /> },
      { path: "docs/colour", element: <Placeholder name="Colour" /> },
      // Replaced by the registry-driven page in Task 9; until then every slug is unknown.
      { path: "docs/components/:slug", element: <NotFound /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
