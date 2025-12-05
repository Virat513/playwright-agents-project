import { test, expect } from '@playwright/test';

test.describe('Inventory Page Functionality', () => {
  test('Product Information Display', async ({ page }) => {
    // Login and navigate to inventory page
    await page.goto('https://www.saucedemo.com/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify each product has required elements
    const products = page.locator('.inventory_item');
    
    for (let i = 0; i < 6; i++) {
      const product = products.nth(i);
      
      // Verify product image
      await expect(product.locator('.inventory_item_img img')).toBeVisible();
      
      // Verify product name (clickable link)
      await expect(product.locator('.inventory_item_name')).toBeVisible();
      
      // Verify product description
      await expect(product.locator('.inventory_item_desc')).toBeVisible();
      
      // Verify price
      await expect(product.locator('.inventory_item_price')).toBeVisible();
      
      // Verify "Add to cart" button
      await expect(product.getByRole('button', { name: /add to cart/i })).toBeVisible();
    }
    
    // Verify specific product names and prices
    await expect(page.getByText('Sauce Labs Backpack')).toBeVisible();
    await expect(page.getByText('$29.99')).toBeVisible();
    
    await expect(page.getByText('Sauce Labs Bike Light')).toBeVisible();
    await expect(page.getByText('$9.99')).toBeVisible();
    
    await expect(page.getByText('Sauce Labs Bolt T-Shirt')).toBeVisible();
    await expect(page.getByText('$15.99')).toBeVisible();
    
    await expect(page.getByText('Sauce Labs Fleece Jacket')).toBeVisible();
    await expect(page.getByText('$49.99')).toBeVisible();
    
    await expect(page.getByText('Sauce Labs Onesie')).toBeVisible();
    await expect(page.getByText('$7.99')).toBeVisible();
    
    await expect(page.getByText('Test.allTheThings() T-Shirt (Red)')).toBeVisible();
  });
});