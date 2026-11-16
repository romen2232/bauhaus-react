import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const root = new URL("..", import.meta.url).pathname;
const url = "http://127.0.0.1:6006";
const server = spawn(
  "pnpm",
  ["exec", "storybook", "dev", "--ci", "--no-open", "--port", "6006"],
  { cwd: root, stdio: "inherit" },
);

const waitForServer = async () => {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Storybook exited with code ${server.exitCode}`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Storybook is still starting.
    }
    await delay(500);
  }
  throw new Error("Storybook did not become available within 60 seconds");
};

const runAccessibilityTests = () =>
  new Promise((resolve, reject) => {
    const testRunner = spawn(
      "pnpm",
      ["exec", "test-storybook", "--url", url, "--maxWorkers", "2"],
      { cwd: root, stdio: "inherit" },
    );
    testRunner.once("error", reject);
    testRunner.once("exit", (code, signal) => {
      if (code === 0) resolve();
      else reject(new Error(`Storybook test runner exited with ${signal ?? code}`));
    });
  });

try {
  await waitForServer();
  console.log("Running browser accessibility checks for stories tagged 'swiss'");
  await runAccessibilityTests();
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
}
