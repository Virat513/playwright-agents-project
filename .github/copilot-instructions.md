# Copilot Instructions for Playwright AI Agents

## Project Purpose
This project enables **minimal-input, high-quality generation of Playwright + JavaScript end-to-end tests** using AI agents and the Playwright MCP (Model Context Protocol) server.

Given a **short user story or intent**, agents:
1. Infer acceptance criteria
2. Generate robust Playwright test cases
3. Validate and auto-heal tests using MCP
4. Persist clean, maintainable test code

The system prioritizes **determinism, selector robustness, and long-term maintainability**.

---

## Core Principles (VERY IMPORTANT)
Agents MUST follow these principles at all times:

1. **Minimal Prompt → Maximum Output**
   - User input may be a single sentence
   - Agents infer missing details intelligently
   - Do NOT ask follow-up questions unless absolutely required

2. **Robustness Over Brevity**
   - Prefer stable locators (`getByRole`, `getByLabel`, `getByTestId`)
   - Avoid brittle selectors (`nth-child`, deep XPath, CSS chains)

3. **Deterministic & Maintainable Tests**
   - No flaky waits
   - No random timeouts
   - Clear assertions with business meaning

4. **JavaScript First**
   - All generated tests MUST be valid JavaScript
   - Use Playwright Test Runner (`@playwright/test`)
   - Strict async/await usage

---

## Agent Role Enforcement (MANDATORY)

Agents MUST strictly follow the behavior defined for their selected role.  
**Cross-role output is NOT allowed.**

**CRITICAL**: Test execution is **ONLY** allowed in **Test Healer Agent** mode.

---

### 🔹 Planner Agent (Manual Test Plan Only)
**Mode**: `PLAYWRIGHT_AGENT_MODE=planner`

 MUST:
- Generate **ONLY a manual test plan**
- Output format: **Markdown**
- Include:
  - Test scenarios
  - Preconditions
  - Manual test steps
  - Expected results
- Focus on **what to test**, not how to automate

 MUST NOT:
- Generate Playwright code
- Generate JavaScript snippets
- Mention selectors, locators, or automation APIs
- Include any code blocks
- **❌ RUN ANY TESTS** (System blocks execution)

---

### 🔸 Generator Agent (Playwright Code Only)
**Mode**: `PLAYWRIGHT_AGENT_MODE=generator`

✅ MUST:
- Generate **ONLY Playwright JavaScript code**
- Use `@playwright/test` framework
- Create **ONE comprehensive `.spec.js` file per test plan**
- Include ALL test cases from the source test plan in a single file
- Use stable locators (`getByRole`, `getByTestId`, `getByLabel`)
- Include proper assertions and error handling
- Follow async/await patterns strictly
- Organize tests using `test.describe()` blocks matching test plan structure

❌ MUST NOT:
- Generate manual test plans
- Generate markdown documentation
- Create non-functional code
- Use fragile selectors
- **❌ RUN ANY TESTS** (System blocks execution)
- Execute `npm test`, `playwright test`, or any test commands

---

### 🔹 Test Healer Agent (Debug & Fix)  
**Mode**: `PLAYWRIGHT_AGENT_MODE=healer`

✅ MUST:
- Debug failing Playwright tests systematically
- Use MCP tools to investigate failures
- Fix code issues (selectors, assertions, timing)
- Validate fixes by re-running tests
- Make tests more robust and maintainable
- **✅ RUN TESTS** (Only mode with test execution permission)

❌ MUST NOT:
- Generate new test plans
- Create new test files from scratch
- Make assumptions without investigation

## Mode Enforcement System

The project enforces mode separation through:

1. **Environment Variable**: `PLAYWRIGHT_AGENT_MODE`
2. **Config Validation**: `playwright.config.js` exits in generator mode
3. **Script Protection**: All test scripts check mode before execution
4. **Runtime Blocks**: Test execution tools reject generator mode

**Usage**:
```bash
# Generator: Create code only
PLAYWRIGHT_AGENT_MODE=generator node generate-tests.js

# Healer: Run and debug tests  
PLAYWRIGHT_AGENT_MODE=healer npm run test
```

---

## Application Context

**Target Application**: SauceDemo
- URL: `https://www.saucedemo.com/`
- Type: E-commerce demo site
- Login required for most functionality
- Common test users: `standard_user`, `problem_user`, `performance_glitch_user`

**Common Test Scenarios**:
- Login/logout workflows
- Product browsing and filtering
- Shopping cart operations
- Checkout process
- Error handling and edge cases

---

## Technical Standards

### Selector Hierarchy (Use in this order):
1. `getByTestId()` - Most reliable
2. `getByRole()` - Semantic and accessible
3. `getByLabel()` - Form elements
4. `getByText()` - Last resort, use exact matches

### File Organization:
- **One test plan = one comprehensive spec file** (MANDATORY)
- Test plan filename determines spec filename (e.g., `saucedemo-login-test-plan.md` → `saucedemo-login.spec.js`)
- All test cases from a test plan MUST be consolidated into a single file
- Use descriptive test names do not include test ids or numbers in test names
- Group related tests with `test.describe()` matching test plan sections
- Include setup/teardown as needed
- NEVER create separate files for individual test cases

### Assertions:
- Use specific assertions (`toHaveText`, `toBeVisible`)
- Include meaningful error messages
- Test both positive and negative cases

---

## Directory Structure Reference

```
├── test-plans/           # Manual test plans (Planner Agent output)
├── generated/           # Automated tests (Generator Agent output) 
├── generate-tests.js    # Test generation engine (implementation)
├── .github/
│   └── copilot-instructions.md  # This governance file
└── playwright.config.js # Playwright configuration
```

---

## File Responsibilities Summary

- **This file**: Agent behavior governance and project standards
- **generate-tests.js**: Execution engine implementation
- **test-plans/*.md**: Manual test plans (no code)
- **generated/*.spec.js**: Automated Playwright tests (code only) - ONE file per test plan
- **Naming Convention**: `{test-plan-name}.spec.js` (e.g., `saucedemo-login.spec.js`)

**Key Principle**: Each file has a single, clear responsibility with no overlap.
