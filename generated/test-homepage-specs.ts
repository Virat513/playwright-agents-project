// spec: specs/plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('SauceDemo Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  test('Loads and shows core login elements', async ({ page }) => {
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator('[data-test="username"]')).toBeVisible();
    await expect(page.locator('[data-test="password"]')).toBeVisible();
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

  test('Shows accepted usernames and password hint', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Accepted usernames are:' })).toBeVisible();
    await expect(page.getByText('standard_user')).toBeVisible();
    await expect(page.getByText('locked_out_user')).toBeVisible();
    await expect(page.getByText('problem_user')).toBeVisible();
    await expect(page.getByText('performance_glitch_user')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Password for all users:' })).toBeVisible();
    await expect(page.getByText('secret_sauce')).toBeVisible();
  });

  test('Error on empty credentials', async ({ page }) => {
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  });

  test('Error when only username provided', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Password is required')).toBeVisible();
  });

  test('Error when only password provided', async ({ page }) => {
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  });

  test('Dismiss error using error button', async ({ page }) => {
    // Trigger an error
    await page.locator('[data-test="login-button"]').click();
    const error = page.getByText('Epic sadface: Username is required');
    await expect(error).toBeVisible();

    // Click the error close (X) button
    await page.locator('[data-test="error"] button').click();

    // Error message disappears
    await expect(error).not.toBeVisible();
  });

  test('Footer social links are present', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Twitter' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Facebook' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
  });
});
