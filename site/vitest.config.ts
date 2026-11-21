import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const siteDir = import.meta.dirname;

export default defineConfig({
  root: siteDir,
  plugins: [react()],
  resolve: { alias: { "bauhaus-react": resolve(siteDir, "../src/index.ts") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
  },
});
