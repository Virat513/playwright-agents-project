# Copilot Instructions for AI Agents

## Project Overview
This project automates the generation, validation, and healing of Playwright end-to-end tests using AI agents and the Playwright MCP (Model Context Protocol) server. It is designed for rapid, robust test authoring and maintenance, targeting web applications.

## Key Components
- **`generate-tests.js`**: Main entry point. Reads a user story, generates acceptance criteria and Playwright test code using OpenAI, then validates and auto-corrects the code with a Playwright agent. Output is saved to `generated/`.
- **`.github/agents/`**: Contains agent definitions for test generation, healing, and planning. Each agent has a clear workflow and toolset (see agent `.md` files for details).
- **`specs/`**: Directory for test plans and documentation.
- **`seed.spec.ts`**: Example or seed test file for reference.

## Developer Workflows
- **Install dependencies**: `npm install`
- **Install Playwright browsers**: `npx playwright install`
- **Generate a test**: `node generate-tests.js` (outputs to `generated/`)
- **Agent workflows**: Agents are invoked programmatically or via MCP server, not directly by CLI.

## Project Conventions
- All generated tests use Playwright Test Runner syntax (`test.describe`, `test` blocks, async/await).
- Tests must use visible selectors from the target site (e.g., https://www.saucedemo.com/), never inventing elements.
- Deterministic, robust, and maintainable test code is required—agents self-correct and validate output.
- Test plans and scenarios are documented in markdown under `specs/`.
- Agent behaviors and tool usage are defined in `.github/agents/*.agent.md`—review these for agent-specific rules and workflows.
- If there is any automation test script that require login use
  - Username: `standard_user`
  - Password: `secret_sauce`

## Integration Points
- **OpenAI**: Used for LLM-based test plan and code generation.
- **Playwright MCP server**: Used for agent-driven test validation, healing, and planning. Invoked via `npx playwright run-test-mcp-server`.

## Examples & Patterns
- See `generate-tests.js` for the full workflow: user story → LLM → agent validation → file output.
- See `.github/agents/playwright-test-healer.agent.md` for systematic debugging/fixing workflow.
- See `.github/agents/playwright-test-planner.agent.md` for comprehensive test planning standards.

## Special Notes
- No custom test runner scripts—use Playwright and agent workflows as described.
- Generated code and plans should be saved in their respective folders (`generated/`, `specs/`).
- Always prefer robust selectors and avoid deprecated Playwright APIs.

---
For more, see the agent `.md` files in `.github/agents/` and the main workflow in `generate-tests.js`.