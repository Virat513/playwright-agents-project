// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('SauceDemo Login', () => {
  test('Successful Login', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Type username "standard_user" into the Username field
    await page.locator('[data-test="username"]').fill('standard_user');

    // 3. Type password "secret_sauce" into the Password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // 5. Verify Products header is visible on the inventory page
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory\.html/);
  });

  test('Invalid Password', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Type username "standard_user" into the Username field
    await page.locator('[data-test="username"]').fill('standard_user');

    // 3. Type password "wrong_password" into the Password field
    await page.locator('[data-test="password"]').fill('wrong_password');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // 5. Verify error message is visible
    await expect(
      page.getByText('Epic sadface: Username and password do not match any user in this service')
    ).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  test('Locked Out User', async ({ page }) => {
    // 1. Navigate to https://www.saucedemo.com/
    await page.goto('https://www.saucedemo.com/');

    // 2. Type username "locked_out_user" into the Username field
    await page.locator('[data-test="username"]').fill('locked_out_user');

    // 3. Type password "secret_sauce" into the Password field
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 4. Click the Login button
    await page.locator('[data-test="login-button"]').click();

    // 5. Verify error message is visible
    await expect(
      page.getByText('Epic sadface: Sorry, this user has been locked out.')
    ).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });
});