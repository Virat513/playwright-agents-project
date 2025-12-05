import { test, expect } from '@playwright/test';

test('Invalid Login - Locked Out User', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('Epic sadface: Sorry, this user has been locked out.')).toBeVisible();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});
