// Simulates a consumer app: builds the package, then compiles CSS that only scans dist/.
// Fails if a class used by the components is invisible to the consumer's Tailwind.
import { execSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

run("pnpm build");
run("pnpm exec tailwindcss -i consumer-smoke/input.css -o consumer-smoke/out.css");
// Types must resolve for consumers on strict Node ESM resolution, not only bundlers.
run("pnpm exec tsc -p consumer-smoke/types/tsconfig.json");

const css = readFileSync(join(root, "consumer-smoke/out.css"), "utf8");
const expected = [
  ".bg-bh-pink",
  ".bg-bh-navy",
  ".text-bh-paper",
  ".grid-cols-5",
  ".rounded-tl-full",
  ".shadow-bh-hard",
  ".motion-safe\\:animate-bh-spin",
  "@keyframes bh-spin",
  ".md\\:grid-cols-3",
  ".focus-visible\\:outline-bh-ink",
  // Every token is a CSS variable, even if no utility uses it (README promise).
  "--color-bh-teal:",
  "--color-bh-khaki:",
];

let failed = false;
for (const needle of expected) {
  const found = css.includes(needle);
  console.log(`${found ? "found  " : "MISSING"} ${needle}`);
  if (!found) failed = true;
}

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
for (const file of walk(join(root, "dist")).filter((f) => f.endsWith(".js"))) {
  if (readFileSync(file, "utf8").includes("bh-${")) {
    console.log(`INTERPOLATED class in ${file}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("consumer smoke: OK");
