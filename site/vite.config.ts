import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vite";

const siteDir = import.meta.dirname;

/** GitHub Pages has no SPA fallback: serve index.html for unknown paths via 404.html. */
const copy404 = (): Plugin => ({
  name: "copy-404",
  closeBundle() {
    copyFileSync(resolve(siteDir, "dist/index.html"), resolve(siteDir, "dist/404.html"));
  },
});

export default defineConfig({
  root: siteDir,
  base: "/bauhaus-react/",
  plugins: [react(), tailwindcss(), copy404()],
  resolve: { alias: { "bauhaus-react": resolve(siteDir, "../src/index.ts") } },
  build: { outDir: "dist", emptyOutDir: true },
});
