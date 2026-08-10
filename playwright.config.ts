import { defineConfig, devices } from "@playwright/test";

const isCi = Boolean(process.env.CI);
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const serverUrl = new URL(baseURL);
const serverPort = serverUrl.port || "80";
const webServerCommand = isCi
  ? `PORT=${serverPort} pnpm --filter @lexgate/web start`
  : `PORT=${serverPort} pnpm --filter @lexgate/web dev`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: !isCi,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  failOnFlakyTests: isCi,
  workers: isCi ? 1 : undefined,
  reporter: isCi
    ? [["line"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: webServerCommand,
    url: new URL("/en", baseURL).toString(),
    reuseExistingServer: !isCi,
    timeout: 120000,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
