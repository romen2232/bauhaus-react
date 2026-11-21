import { Navigate, type RouteObject } from "react-router";
import { ComponentRoute } from "./docs/ComponentRoute";
import { DocsLayout } from "./docs/DocsLayout";
import { LandingPage } from "./landing/LandingPage";
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
      { index: true, element: <LandingPage /> },
      {
        path: "docs",
        element: <DocsLayout />,
        children: [
          { index: true, element: <Navigate to="getting-started/install" replace /> },
          { path: "getting-started/:page", element: <Placeholder name="Getting started" /> },
          { path: "principles", element: <Placeholder name="Principles" /> },
          { path: "colour", element: <Placeholder name="Colour" /> },
          { path: "components/:slug", element: <ComponentRoute /> },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
