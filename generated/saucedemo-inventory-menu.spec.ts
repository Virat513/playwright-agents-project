import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  test('Menu Navigation', async ({ page }) => {
    // Login and navigate to inventory page
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Click hamburger menu button
    await page.getByRole('button', { name: 'Open Menu' }).click();
    
    // Verify menu slides out with options
    await expect(page.locator('.bm-menu')).toBeVisible();
    await expect(page.getByRole('link', { name: 'All Items' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reset App State' })).toBeVisible();
    
    // Test All Items functionality (should stay on inventory)
    await page.getByRole('link', { name: 'All Items' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Test Reset App State
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Reset App State' }).click();
    
    // Test About (opens external link)
    await page.getByRole('button', { name: 'Open Menu' }).click();
    const aboutLink = page.getByRole('link', { name: 'About' });
    await expect(aboutLink).toHaveAttribute('href', 'https://saucelabs.com/');
    
    // Test Logout functionality
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    
    // Test menu can be closed (re-login first)
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('button', { name: 'Close Menu' }).click();
    await expect(page.locator('.bm-menu')).not.toBeVisible();
  });
});