import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { defineConfig } from "vitest/config";

const copyThemeCss = (): Plugin => ({
  name: "copy-theme-css",
  closeBundle() {
    mkdirSync(resolve(import.meta.dirname, "dist"), { recursive: true });
    copyFileSync(resolve(import.meta.dirname, "src/theme.css"), resolve(import.meta.dirname, "dist/theme.css"));
  },
});

export default defineConfig({
  plugins: [react(), copyThemeCss()],
  build: {
    lib: { entry: resolve(import.meta.dirname, "src/index.ts"), formats: ["es"] },
    sourcemap: true,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "clsx", "tailwind-merge"],
      output: { preserveModules: true, preserveModulesRoot: "src", entryFileNames: "[name].js" },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
