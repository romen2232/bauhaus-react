import { createBrowserRouter } from "react-router";
import { routes } from "./routes";

/**
 * The app router. `baseUrl` is Vite's BASE_URL ("/bauhaus-react/" on GitHub Pages).
 * It is passed through with its trailing slash: stripping it would turn the home URL into
 * "/bauhaus-react?look=soft", which static hosts and `vite preview` do not serve on reload.
 */
export function createAppRouter(baseUrl: string = import.meta.env.BASE_URL) {
  return createBrowserRouter(routes, { basename: baseUrl });
}
