// Builds Storybook and checks its CSS was processed by Tailwind (utilities generated from stories).
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
execSync("pnpm build-storybook --quiet", { cwd: root, stdio: "inherit" });

const assets = join(root, "storybook-static/assets");
const css = readdirSync(assets)
  .filter((f) => f.endsWith(".css"))
  .map((f) => readFileSync(join(assets, f), "utf8"))
  .join("\n");

const checks = [
  [".bg-bh-yellow", true],
  [".rounded-tl-full", true],
  ["--color-bh-paper", true],
  ["color-mix(in srgb", true],
  ["@theme", false], // raw Tailwind source must not leak into the output
  [".bg-bh-paper-white", true],
  [".min-w-\\(--trigger-width\\)", true], // Select popover width, only used by the form skins
  [".fill-bh-ink", true], // chart marks: first drawn by BarChartSwiss
];

let failed = false;
for (const [needle, shouldExist] of checks) {
  const ok = css.includes(needle) === shouldExist;
  console.log(`${ok ? "ok     " : "FAILED "} ${shouldExist ? "has" : "lacks"} ${needle}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
console.log("storybook css: OK");

execSync("node consumer-smoke/check-storybook-a11y.mjs", { cwd: root, stdio: "inherit" });
