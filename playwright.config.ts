import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 40_000,
  use: {
    baseURL: "http://127.0.0.1:3000"
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
    timeout: 90_000
  }
});
