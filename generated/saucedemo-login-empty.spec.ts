import { test, expect } from '@playwright/test';

test('Empty Credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Epic sadface: Username is required')).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
