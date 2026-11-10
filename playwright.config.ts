import { defineConfig } from "@playwright/test";

// Smoke suite for the app shell. It runs against a real dev server so the
// localStorage round-trips, hydration and routing are exercised for real —
// the things a unit test can't see and that broke most often in practice.
//
// Run with: npm run test:smoke
// First run needs: npx playwright install chromium

const PORT = Number(process.env.SMOKE_PORT ?? 3210);

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1, // one context, so seeded storage behaves predictably
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Dummy values: the smoke suite never signs in, but the auth/sync routes
      // import Prisma at module scope, so the build needs them present.
      // `npm run test:sync` passes a file: URL to a throwaway SQLite db.
      DATABASE_URL: process.env.DATABASE_URL ?? "postgresql://smoke:smoke@localhost:5432/smoke",
      NEXTAUTH_SECRET: "smoke-test-secret",
      NEXTAUTH_URL: `http://localhost:${PORT}`,
    },
  },
});
