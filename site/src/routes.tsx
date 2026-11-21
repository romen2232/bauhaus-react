import { Navigate, type RouteObject } from "react-router";
import { ComponentRoute } from "./docs/ComponentRoute";
import { DocsLayout } from "./docs/DocsLayout";
import { Colour } from "./docs/pages/Colour";
import { GettingStarted } from "./docs/pages/GettingStarted";
import { Principles } from "./docs/pages/Principles";
import { LandingPage } from "./landing/LandingPage";
import { NotFound } from "./pages/NotFound";
import { SiteLayout } from "./shell/SiteLayout";

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
          { path: "getting-started/:page", element: <GettingStarted /> },
          { path: "principles", element: <Principles /> },
          { path: "colour", element: <Colour /> },
          { path: "components/:slug", element: <ComponentRoute /> },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
];
