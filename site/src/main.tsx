import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { createAppRouter } from "./router";
import "./styles.css";

createRoot(document.getElementById("root")!).render(<RouterProvider router={createAppRouter()} />);
