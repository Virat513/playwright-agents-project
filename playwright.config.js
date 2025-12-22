import { defineConfig, devices } from '@playwright/test';

/**
 * Application Metadata
 * (Single source of truth for agents & reports)
 */
const APPLICATION_NAME = 'SauceDemo';
const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

/**
 * Agent Mode Detection
 * PLAYWRIGHT_AGENT_MODE values: 'planner', 'generator', 'healer'
 * Tests should ONLY run in 'healer' mode
 */
const AGENT_MODE = process.env.PLAYWRIGHT_AGENT_MODE || 'healer';
const IS_HEALER_MODE = AGENT_MODE === 'healer';
const IS_GENERATOR_MODE = AGENT_MODE === 'generator';

// Exit early if in generator mode to prevent test execution
if (IS_GENERATOR_MODE) {
  console.log('🔸 Generator Agent Mode: Test execution is disabled. Use healer mode to run tests.');
  process.exit(0);
}

/**
 * Default Report Configuration
 * Using standard Playwright reporting locations
 */

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: IS_HEALER_MODE ? './generated' : null, // Only set testDir in healer mode

  /* Run tests in parallel */
  fullyParallel: true,

  /* Fail CI build if test.only is left */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporters */
  reporter: [
    // HTML Report (default location: playwright-report/)
    ['html', {
      open: process.env.CI ? 'never' : 'on-failure',
      host: 'localhost',
      port: 9323,
    }],
    // Console output for real-time feedback
    ['line'],
    // Allure Report (default location: allure-results/)
    ['allure-playwright', {
      detail: true,
      suiteTitle: false,
      categories: [
        {
          name: 'Outdated tests',
          messageRegex: '.*deprecated.*',
        },
        {
          name: 'Regression', 
          messageRegex: '.*regression.*',
        },
        {
          name: 'Flaky tests',
          messageRegex: '.*flaky.*',
        },
      ],
      environmentInfo: {
        application: APPLICATION_NAME,
        base_url: BASE_URL,
        framework: 'playwright',
        node_version: process.version,
        browser: 'microsoft-edge',
        manual_test_plans: './manual-test-plans',
        timestamp: new Date().toISOString(),
      },
    }],
  ],

  /* Output directory for test artifacts */
  outputDir: 'test-results',

  /* Shared settings for all tests */
  use: {
    /* Run in headed mode */
    headless: false,

    /* Base URL for page.goto('/') */
    baseURL: BASE_URL,

    /* Artifacts on all tests for better reporting */
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Collect additional context for reports */
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },

  /* ✅ Single browser execution: Microsoft Edge */
  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});
