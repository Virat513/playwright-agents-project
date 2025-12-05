import { test, expect } from '@playwright/test';

test('UI Validation', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Accepted usernames are:')).toBeVisible();
  await expect(page.getByText('Password for all users:')).toBeVisible();
});
