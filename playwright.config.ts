import { EyesFixture } from "@applitools/eyes-playwright/fixture";
import { defineConfig, devices } from "@playwright/test";
require("dotenv").config();

export default defineConfig<EyesFixture>({
  testDir: "./src",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 1,
  expect: {
    toMatchSnapshot: { maxDiffPixels: 100 },
  },
  reporter: "html",

  use: {
    /* Configuration for Eyes VisualAI */
    eyesConfig: {
      /* The following and other configuration parameters are documented at: https://applitools.com/tutorials/playwright/api/overview */
      apiKey: "1dCdtIWULCcSEM9H98dyHQhTWgtn2IyAbh44qBebV9b0110", // alternatively, set this via environment variable APPLITOOLS_API_KEY
      // serverUrl: 'https://eyes.applitools.com',

      // failTestsOnDiff: false,
      appName: "Booking Care",
      // matchLevel: 'Strict',
      // batch: { name: 'My Batch' },
      // proxy: {url: 'http://127.0.0.1:8888'},
      // stitchMode: 'CSS',
      // matchTimeout: 0,
      // waitBeforeScreenshots: 50,
      // saveNewTests: true,
    },

    baseURL: process.env.VUE_URL,
    trace: "on-first-retry",
    video: {
      mode: "off",
      size: { width: 1920, height: 1080 },
    }, //run test by command line
  },
  outputDir: "test-results/screenshots",

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
