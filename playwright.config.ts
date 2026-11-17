import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env";

export default defineConfig({
  testDir: "./tests",

  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],

    [
      "junit",
      {
        outputFile: "reports/junit/results.xml",
      },
    ],

    [
      "json",
      {
        outputFile: "reports/json/results.json",
      },
    ],
  ],

  use: {
    baseURL: env.baseUrl,

    trace: "on-first-retry",

    screenshot: "only-on-failure",

    video: "retain-on-failure",

    headless: env.headless,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
