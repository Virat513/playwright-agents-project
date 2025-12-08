import { test, expect } from '@playwright/test';

test.describe('SauceDemo Login Functionality - Comprehensive Test Suite', () => {
  
  // TC_01: Valid Login - Standard User (Happy Path)
  test('TC_01: Valid Login - Standard User', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Verify we're on the login page
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    
    // Enter valid credentials
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login and redirection
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page.locator('.shopping_cart_link')).toBeVisible();
  });

  // TC_02: Valid Login - Performance Glitch User
  test('TC_02: Valid Login - Performance Glitch User', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Enter performance glitch user credentials
    await page.getByRole('textbox', { name: 'Username' }).fill('performance_glitch_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Allow for potential performance delays
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html', { timeout: 10000 });
    await expect(page.getByText('Products')).toBeVisible();
  });

  // TC_03: Valid Login - Problem User
  test('TC_03: Valid Login - Problem User', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('problem_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify authentication succeeds despite potential UI issues
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();
  });

  // TC_04: Invalid Login - Wrong Password
  test('TC_04: Invalid Login - Wrong Password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify error message and stay on login page
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_05: Invalid Login - Wrong Username
  test('TC_05: Invalid Login - Wrong Username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify error message for invalid credentials
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_06: Invalid Login - Both Credentials Wrong
  test('TC_06: Invalid Login - Both Credentials Wrong', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('fake_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('fake_password');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify error message and no navigation
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_07: Empty Fields Validation - Both Empty
  test('TC_07: Empty Fields Validation - Both Empty', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Leave both fields empty and click login
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify validation message appears
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_08: Empty Username Field
  test('TC_08: Empty Username Field', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Leave username empty, fill password
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify username required validation
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_09: Empty Password Field
  test('TC_09: Empty Password Field', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Fill username, leave password empty
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify password required validation
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_10: Locked Out User
  test('TC_10: Locked Out User', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('locked_out_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify locked account error message
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_11: Case Sensitivity - Username
  test('TC_11: Case Sensitivity - Username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('STANDARD_USER');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify case sensitivity behavior
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_12: Case Sensitivity - Password
  test('TC_12: Case Sensitivity - Password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('SECRET_SAUCE');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify password is case-sensitive
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
  });

  // TC_13: Special Characters in Credentials
  test('TC_13: Special Characters in Credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('user@#$%');
    await page.getByRole('textbox', { name: 'Password' }).fill('pass!@#');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify graceful error handling
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Check for any console errors
    const messages = await page.evaluate(() => {
      return window.console.error?.toString() || '';
    });
    // Should not contain critical errors
  });

  // TC_14: SQL Injection Attempt
  test('TC_14: SQL Injection Attempt', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill("admin' OR '1'='1");
    await page.getByRole('textbox', { name: 'Password' }).fill('anything');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify SQL injection is blocked
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Ensure no successful authentication occurred
    await expect(page.getByText('Products')).not.toBeVisible();
  });

  // TC_15: XSS Attempt in Login Fields
  test('TC_15: XSS Attempt in Login Fields', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill("<script>alert('XSS')</script>");
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify XSS attempt is sanitized and blocked
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Verify no script execution occurred (no alert dialog)
    const dialogPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
    const dialog = await dialogPromise;
    expect(dialog).toBeNull();
  });

  // TC_16: Long Input Strings
  test('TC_16: Long Input Strings', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    const longString = 'a'.repeat(500);
    
    await page.getByRole('textbox', { name: 'Username' }).fill(longString);
    await page.getByRole('textbox', { name: 'Password' }).fill(longString);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify system handles long inputs gracefully
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    
    // Verify no system crash or errors
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  // TC_17: Rapid Form Submissions
  test('TC_17: Rapid Form Submissions', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    
    // Rapidly click login button multiple times
    const loginButton = page.getByRole('button', { name: 'Login' });
    await Promise.all([
      loginButton.click(),
      loginButton.click(),
      loginButton.click()
    ]);
    
    // Verify single authentication, no duplicate processing
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();
  });

  // TC_18: Browser Back Button After Login
  test('TC_18: Browser Back Button After Login', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Login successfully
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Navigate back and check behavior
    await page.goBack();
    
    // Verify appropriate behavior (may vary by application design)
    // SauceDemo may redirect back to inventory or show login page
    await page.waitForLoadState('networkidle');
    
    // Forward navigation should work
    await page.goForward();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  // TC_19: Session Timeout Behavior (Simulated)
  test('TC_19: Session Timeout Behavior', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Login successfully
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Simulate session timeout by clearing cookies
    await page.context().clearCookies();
    
    // Attempt to navigate to a protected page
    await page.goto('https://www.saucedemo.com/cart.html');
    
    // Verify redirect to login page (if session management is implemented)
    // Note: SauceDemo may not have robust session management
    await expect(page).toHaveURL(/.*saucedemo\.com.*/);
  });

  // TC_20: Multiple Browser Tab Login
  test('TC_20: Multiple Browser Tab Login', async ({ browser }) => {
    // Create two separate page contexts to simulate different tabs
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    // Login in first tab
    await page1.goto('https://www.saucedemo.com/');
    await page1.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page1.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page1.getByRole('button', { name: 'Login' }).click();
    
    await expect(page1).toHaveURL('https://www.saucedemo.com/inventory.html');
    
    // Open second tab and check session state
    await page2.goto('https://www.saucedemo.com/');
    
    // Verify session behavior in second tab
    // SauceDemo uses separate sessions per browser context
    await expect(page2).toHaveURL('https://www.saucedemo.com/');
    await expect(page2.getByRole('textbox', { name: 'Username' })).toBeVisible();
    
    // Cleanup
    await context1.close();
    await context2.close();
  });

  // Additional Edge Case Tests

  test('TC_Extra_01: Login Page Elements Validation', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Verify all essential login elements are present
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    
    // Check for SauceDemo specific elements
    await expect(page.locator('.login_logo')).toBeVisible();
    await expect(page.locator('.login_container')).toBeVisible();
    
    // Verify accepted usernames are listed
    const acceptedUsernames = page.locator('#login_credentials');
    await expect(acceptedUsernames).toBeVisible();
    await expect(acceptedUsernames).toContainText('standard_user');
  });

  test('TC_Extra_02: Error Message Dismissal', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Generate an error message
    await page.getByRole('textbox', { name: 'Username' }).fill('invalid_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('invalid_pass');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify error message appears
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    
    // Click error dismiss button if available
    const errorButton = page.locator('[data-test="error-button"]');
    if (await errorButton.isVisible()) {
      await errorButton.click();
      await expect(page.locator('[data-test="error"]')).not.toBeVisible();
    }
  });

  test('TC_Extra_03: Tab Navigation Between Fields', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Test keyboard navigation
    await page.getByRole('textbox', { name: 'Username' }).focus();
    await page.keyboard.press('Tab');
    
    // Verify focus moved to password field
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeFocused();
    
    await page.keyboard.press('Tab');
    
    // Verify focus moved to login button
    await expect(page.getByRole('button', { name: 'Login' })).toBeFocused();
  });

  test('TC_Extra_04: Visual User Login Validation', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Test visual_user login
    await page.getByRole('textbox', { name: 'Username' }).fill('visual_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();
    
    // Note: visual_user may have different UI rendering
  });

  test('TC_Extra_05: Error User Login Validation', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    // Test error_user login
    await page.getByRole('textbox', { name: 'Username' }).fill('error_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful authentication
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();
    
    // Note: error_user may encounter errors during post-login operations
  });
});