import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  test('Product Sorting', async ({ page }) => {
    // Login and navigate to inventory page
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    const sortDropdown = page.locator('[data-testid="product_sort_container"]');
    
    // Test default sorting (Name A to Z)
    await expect(sortDropdown).toHaveValue('az');
    const firstProductDefault = page.locator('.inventory_item_name').first();
    await expect(firstProductDefault).toContainText('Sauce Labs Backpack');
    
    // Test sorting by Name (Z to A)
    await sortDropdown.selectOption('za');
    const firstProductZA = page.locator('.inventory_item_name').first();
    await expect(firstProductZA).toContainText('Test.allTheThings()');
    
    // Test sorting by Price (low to high)
    await sortDropdown.selectOption('lohi');
    const firstProductLowHigh = page.locator('.inventory_item_price').first();
    await expect(firstProductLowHigh).toContainText('$7.99');
    
    // Test sorting by Price (high to low)
    await sortDropdown.selectOption('hilo');
    const firstProductHighLow = page.locator('.inventory_item_price').first();
    await expect(firstProductHighLow).toContainText('$49.99');
    
    // Verify products reorder correctly
    await sortDropdown.selectOption('az');
    const backToDefault = page.locator('.inventory_item_name').first();
    await expect(backToDefault).toContainText('Sauce Labs Backpack');
  });
});