import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  test('Shopping Cart Access', async ({ page }) => {
    // Login and navigate to inventory page
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Add items to cart
    await page.locator('[data-testid="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-testid="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Verify cart badge shows correct count
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // Click shopping cart icon
    await page.locator('.shopping_cart_link').click();
    
    // Verify navigation to cart page
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    
    // Verify cart contains added items
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    
    // Verify cart functionality
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(2);
    
    // Test back to inventory from cart
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});