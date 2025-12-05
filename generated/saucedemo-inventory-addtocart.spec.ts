import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  test('Add Products to Cart', async ({ page }) => {
    // Login and navigate to inventory page
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Add Sauce Labs Backpack to cart
    const backpackAddBtn = page.locator('[data-testid="add-to-cart-sauce-labs-backpack"]');
    await backpackAddBtn.click();
    
    // Verify button text changes to "Remove"
    await expect(page.locator('[data-testid="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Verify shopping cart badge shows "1"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    
    // Add Sauce Labs Bike Light to cart
    const bikeLightAddBtn = page.locator('[data-testid="add-to-cart-sauce-labs-bike-light"]');
    await bikeLightAddBtn.click();
    
    // Verify cart badge shows "2"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // Add one more product
    const tshirtAddBtn = page.locator('[data-testid="add-to-cart-sauce-labs-bolt-t-shirt"]');
    await tshirtAddBtn.click();
    
    // Verify cart badge shows "3"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    
    // Remove backpack from cart
    const backpackRemoveBtn = page.locator('[data-testid="remove-sauce-labs-backpack"]');
    await backpackRemoveBtn.click();
    
    // Verify button text changes back to "Add to cart"
    await expect(page.locator('[data-testid="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
    
    // Verify cart badge shows "2"
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });
});