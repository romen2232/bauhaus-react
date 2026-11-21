import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "./routes";
import "./styles.css";

const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, "") });

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
