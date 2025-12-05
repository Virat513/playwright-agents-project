import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  test('Page Load and UI Validation', async ({ page }) => {
    // Login with valid credentials
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful navigation to inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Verify page title
    await expect(page).toHaveTitle('Swag Labs');
    
    // Verify "Products" heading is visible
    await expect(page.getByText('Products')).toBeVisible();
    
    // Verify sort dropdown is present
    await expect(page.locator('[data-testid="product_sort_container"]')).toBeVisible();
    
    // Verify all 6 products are displayed
    const products = page.locator('.inventory_item');
    await expect(products).toHaveCount(6);
    
    // Verify hamburger menu is present
    await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();
    
    // Verify shopping cart icon is present
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });
});