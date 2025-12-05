# SauceDemo Login Test Plan

## Application Overview

Test plan for the login functionality of https://www.saucedemo.com/. Covers valid login, invalid login, edge cases, and UI validation.

## Test Scenarios

### 1. Login Functionality

**Seed:** `seed.spec.ts`

#### 1.1. Valid Login

**File:** `generated/saucedemo-login.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Wait for the login form to be visible
  3. Enter username 'standard_user'
  4. Enter password 'secret_sauce'
  5. Click the 'Login' button
  6. Verify navigation to the products page (inventory.html)

**Expected Results:**
  - User is redirected to /inventory.html
  - Products page is displayed

#### 1.2. Invalid Login - Wrong Password

**File:** `generated/saucedemo-login-invalid-password.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Wait for the login form to be visible
  3. Enter username 'standard_user'
  4. Enter password 'wrong_password'
  5. Click the 'Login' button
  6. Verify error message is displayed

**Expected Results:**
  - Error message 'Epic sadface: Username and password do not match any user in this service' is shown
  - User remains on the login page

#### 1.3. Invalid Login - Locked Out User

**File:** `generated/saucedemo-login-lockedout.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Wait for the login form to be visible
  3. Enter username 'locked_out_user'
  4. Enter password 'secret_sauce'
  5. Click the 'Login' button
  6. Verify error message is displayed

**Expected Results:**
  - Error message 'Epic sadface: Sorry, this user has been locked out.' is shown
  - User remains on the login page

#### 1.4. Empty Credentials

**File:** `generated/saucedemo-login-empty.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Wait for the login form to be visible
  3. Leave username and password fields empty
  4. Click the 'Login' button
  5. Verify error message is displayed

**Expected Results:**
  - Error message 'Epic sadface: Username is required' is shown
  - User remains on the login page

#### 1.5. UI Validation

**File:** `generated/saucedemo-login-ui.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
  2. Verify login form is present
  3. Verify username and password fields are visible
  4. Verify login button is visible
  5. Verify accepted usernames and password info are displayed

**Expected Results:**
  - All login form elements are visible and correctly labeled
