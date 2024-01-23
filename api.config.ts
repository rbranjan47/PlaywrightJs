import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  timeout: 30000,
  retries: 0,
  testDir: "./tests/API",
  use: {
    headless: false,
    viewport: { width: 2133, height: 1027 },
    actionTimeout: 10000,
    ignoreHTTPSErrors: true,
    video: "off",
    screenshot: "off",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

export default config;
