import { test, expect } from '@playwright/test';

test.describe('SauceDemo Login Functionality - All Scenarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

  // Positive Login Scenarios
  
  test('Login with standard_user - Happy Path', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

//   test('Login with problem_user', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('problem_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//     await expect(page.getByText('Products')).toBeVisible();
//   });

//   test('Login with performance_glitch_user', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('performance_glitch_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     // Allow extra time for performance glitch
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html', { timeout: 15000 });
//     await expect(page.getByText('Products')).toBeVisible();
//   });

//   test('Login with error_user', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('error_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//     await expect(page.getByText('Products')).toBeVisible();
//   });

//   test('Login with visual_user', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('visual_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//     await expect(page.getByText('Products')).toBeVisible();
//   });

 
//   test('Login with invalid username', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
//   });

//   test('Login with invalid password', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('wrong_password');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
//   });

//   test('Login with both invalid credentials', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('fake_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('fake_password');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
//   });

//   // Empty Field Validation

//   test('Login with empty username and password', async ({ page }) => {
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
//   });

//   test('Login with empty username only', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
//   });

//   test('Login with empty password only', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
//   });

//   // Case Sensitivity Tests

//   test('Login with uppercase username', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('STANDARD_USER');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   test('Login with uppercase password', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('SECRET_SAUCE');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   test('Login with mixed case username', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('Standard_User');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   // Special Characters and Edge Cases

//   test('Login with special characters in username', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('user@#$%');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   test('Login with special characters in password', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('pass!@#$');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   test('Login with leading/trailing spaces in username', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('  standard_user  ');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   test('Login with leading/trailing spaces in password', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('  secret_sauce  ');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   // Boundary Value Testing

//   test('Login with very long username', async ({ page }) => {
//     const longUsername = 'a'.repeat(100);
//     await page.getByRole('textbox', { name: 'Username' }).fill(longUsername);
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });

//   test('Login with very long password', async ({ page }) => {
//     const longPassword = 'a'.repeat(100);
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill(longPassword);
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
//     await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
//   });


//   test('Verify login page elements are visible', async ({ page }) => {
//     await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
//     await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
//     await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
//     await expect(page.locator('.login_logo')).toBeVisible();
//     await expect(page.locator('#login_credentials')).toBeVisible();
//   });

//   test('Verify tab navigation between form fields', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).focus();
//     await page.keyboard.press('Tab');
    
//     await expect(page.getByRole('textbox', { name: 'Password' })).toBeFocused();
    
//     await page.keyboard.press('Tab');
//     await expect(page.getByRole('button', { name: 'Login' })).toBeFocused();
//   });

//   test('Verify Enter key submits the form', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//   });

//   test('Error message dismissal functionality', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('invalid_pass');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page.locator('[data-test="error"]')).toBeVisible();
    
//     // Click the error dismiss button
//     await page.locator('[data-test="error-button"]').click();
//     await expect(page.locator('[data-test="error"]')).not.toBeVisible();
//   });

//   // Rapid Submission Testing

//   test('Rapid multiple login attempts', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    
//     // Rapidly click login button multiple times
//     const loginButton = page.getByRole('button', { name: 'Login' });
//     await Promise.all([
//       loginButton.click(),
//       loginButton.click(),
//       loginButton.click()
//     ]);
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//   });

//   // Browser Behavior Testing

//   test('Login state after browser back/forward', async ({ page }) => {
//     // Login successfully
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
//     // Navigate back
//     await page.goBack();
//     await page.waitForLoadState('networkidle');
    
//     // Navigate forward
//     await page.goForward();
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//   });

//   test('Login with browser refresh during process', async ({ page }) => {
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    
//     // Refresh page before clicking login
//     await page.reload();
    
//     // Fields should be cleared after refresh
//     await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('');
//     await expect(page.getByRole('textbox', { name: 'Password' })).toHaveValue('');
//   });

//   // Session Management

//   test('Logout and re-login functionality', async ({ page }) => {
//     // Login first
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
//     // Open menu and logout
//     await page.getByRole('button', { name: 'Open Menu' }).click();
//     await page.getByRole('link', { name: 'Logout' }).click();
    
//     // Verify back on login page
//     await expect(page).toHaveURL('https://www.saucedemo.com/');
    
//     // Re-login with same credentials
//     await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
//     await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
//     await page.getByRole('button', { name: 'Login' }).click();
    
//     await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//   });


});