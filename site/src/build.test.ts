// @vitest-environment node
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const REPO = resolve(import.meta.dirname, "../..");
const DIST = resolve(REPO, "site/dist");

describe("static build", () => {
  beforeAll(() => {
    execSync("pnpm site:build", { cwd: REPO, stdio: "pipe" });
  }, 180_000);

  test("404.html is a copy of index.html (GitHub Pages SPA fallback)", () => {
    expect(readFileSync(resolve(DIST, "404.html"))).toEqual(readFileSync(resolve(DIST, "index.html")));
  });

  test("index.html references assets under the Pages base path", () => {
    const html = readFileSync(resolve(DIST, "index.html"), "utf8");
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]!).filter((r) => r.startsWith("/"));
    expect(refs.length).toBeGreaterThan(0);
    for (const ref of refs) expect(ref.startsWith("/bauhaus-react/"), ref).toBe(true);
  });

  test("ships the favicon and the demo audio", () => {
    expect(existsSync(resolve(DIST, "favicon.svg"))).toBe(true);
    expect(existsSync(resolve(DIST, "silence.wav"))).toBe(true);
  });

  test("bundles css and js assets", () => {
    const assets = readdirSync(resolve(DIST, "assets"));
    expect(assets.some((f) => f.endsWith(".css"))).toBe(true);
    expect(assets.some((f) => f.endsWith(".js"))).toBe(true);
  });
});
