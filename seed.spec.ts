import { test, expect } from '@playwright/test';

test.describe('SauceDemo Login Setup', () => {
  test('seed - setup login page', async ({ page }) => {
    // Navigate to SauceDemo login page
    await page.goto('https://www.saucedemo.com/');
    
    // Verify login page elements are visible
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
