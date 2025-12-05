# SauceDemo Inventory Page Test Plan

## Overview
Test plan for the inventory page functionality of https://www.saucedemo.com/inventory.html after successful login. Covers product display, filtering, sorting, cart operations, and navigation.

**Prerequisite:** User must be successfully logged in with valid credentials (standard_user/secret_sauce).

## Test Suite: Inventory Page Functionality

### Test Case 1: Page Load and UI Validation
**File:** `generated/saucedemo-inventory-ui.spec.ts`
**Steps:**
1. Login with valid credentials (standard_user/secret_sauce)
2. Verify successful navigation to /inventory.html
3. Verify page title is "Swag Labs"
4. Verify "Products" heading is visible
5. Verify sort dropdown is present and functional
6. Verify all 6 products are displayed
7. Verify hamburger menu is present
8. Verify shopping cart icon is present

**Expected Results:**
- Page loads successfully with all UI elements visible
- All products are displayed in grid format
- Navigation elements are functional

### Test Case 2: Product Information Display
**File:** `generated/saucedemo-inventory-products.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Verify each product has:
   - Product image
   - Product name (clickable link)
   - Product description
   - Price
   - "Add to cart" button
3. Verify product names:
   - Sauce Labs Backpack ($29.99)
   - Sauce Labs Bike Light ($9.99)
   - Sauce Labs Bolt T-Shirt ($15.99)
   - Sauce Labs Fleece Jacket ($49.99)
   - Sauce Labs Onesie ($7.99)
   - Test.allTheThings() T-Shirt (Red) ($15.99)

**Expected Results:**
- All product information is correctly displayed
- Product images load properly
- Prices are formatted correctly

### Test Case 3: Product Sorting
**File:** `generated/saucedemo-inventory-sorting.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Test sorting by "Name (A to Z)" - verify default order
3. Select "Name (Z to A)" and verify reverse alphabetical order
4. Select "Price (low to high)" and verify ascending price order
5. Select "Price (high to low)" and verify descending price order
6. Verify products reorder correctly for each sorting option

**Expected Results:**
- Default sorting is Name (A to Z)
- All sorting options work correctly
- Product order changes as expected

### Test Case 4: Add Products to Cart
**File:** `generated/saucedemo-inventory-addtocart.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Click "Add to cart" for Sauce Labs Backpack
3. Verify button text changes to "Remove"
4. Verify shopping cart badge shows "1"
5. Add Sauce Labs Bike Light to cart
6. Verify cart badge shows "2"
7. Add multiple products and verify cart count updates
8. Click "Remove" and verify item is removed from cart

**Expected Results:**
- Products are added to cart successfully
- Cart badge updates with correct count
- "Add to cart" button toggles to "Remove"
- Remove functionality works correctly

### Test Case 5: Product Detail Navigation
**File:** `generated/saucedemo-inventory-navigation.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Click on product name link for "Sauce Labs Backpack"
3. Verify navigation to product detail page
4. Verify URL changes to include product ID
5. Test navigation for different products
6. Verify back navigation returns to inventory

**Expected Results:**
- Product name links navigate to detail pages
- URLs are correctly formatted
- Navigation works for all products

### Test Case 6: Menu Navigation
**File:** `generated/saucedemo-inventory-menu.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Click hamburger menu button
3. Verify menu slides out with options:
   - All Items
   - About
   - Logout
   - Reset App State
4. Test each menu option functionality
5. Verify menu can be closed

**Expected Results:**
- Menu opens and closes properly
- All menu items are functional
- Logout returns to login page
- About navigates to external site

### Test Case 7: Shopping Cart Access
**File:** `generated/saucedemo-inventory-cart.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Add items to cart
3. Click shopping cart icon
4. Verify navigation to cart page
5. Verify cart contains added items
6. Test cart functionality from inventory page

**Expected Results:**
- Cart icon is clickable
- Navigation to cart page works
- Cart shows correct items

### Test Case 8: Responsive Design (Optional)
**File:** `generated/saucedemo-inventory-responsive.spec.ts`
**Steps:**
1. Login and navigate to inventory page
2. Test page at different viewport sizes
3. Verify mobile responsiveness
4. Check product grid layout at various sizes

**Expected Results:**
- Page is responsive across devices
- Product grid adapts to screen size
- All functionality remains accessible

## Test Data
- Valid credentials: standard_user / secret_sauce
- Product count: 6 items
- Price range: $7.99 - $49.99
- Base URL: https://www.saucedemo.com/inventory.html

## Notes
- All tests assume successful login prerequisite
- Tests should handle potential performance issues with performance_glitch_user
- Visual tests may need adjustment for visual_user
- Error scenarios should be covered in separate error handling test suite