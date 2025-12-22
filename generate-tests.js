/**
 * Playwright Test Generator – SauceDemo
 *
 * Responsibilities:
 * 1. Knows the application under test (SauceDemo)
 * 2. Knows the base URL
 * 3. Generates JavaScript + Playwright test cases
 * 4. Reads manual test cases from /test-plans
 * 5. Writes automation scripts to /generated
 * 6. Ensures ONE test file per functionality
 * 7. DOES NOT run tests - only generates code
 */

import fs from "fs";
import path from "path";
import OpenAI from "openai";

/**
 * Agent Mode Enforcement
 * This script should ONLY generate test code, never execute tests
 */
const AGENT_MODE = process.env.PLAYWRIGHT_AGENT_MODE || 'generator';
if (AGENT_MODE === 'healer') {
  console.warn('⚠️  Generator script running in healer mode. Consider using test execution tools instead.');
}

console.log(`🔸 Generator Agent Mode: Creating test code only (no execution)`);

/**
 * ===============================
 * APPLICATION METADATA (GLOBAL)
 * ===============================
 */
const APP_CONTEXT = {
  name: "SauceDemo",
  baseUrl: "https://www.saucedemo.com/",
  framework: "Playwright",
  language: "JavaScript"
};

/**
 * ===============================
 * DIRECTORY STRUCTURE
 * ===============================
 */
const TEST_PLANS_DIR = path.resolve("test-plans");
const GENERATED_DIR = path.resolve("generated");

/**
 * Ensure output directory exists
 */
if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

/**
 * ===============================
 * LLM CLIENT
 * ===============================
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * ===============================
 * SYSTEM PROMPT (STRICT RULES)
 * ===============================
 */
function buildSystemPrompt() {
  return `
You are a Senior QA Automation Engineer.

Application under test:
- Name: ${APP_CONTEXT.name}
- URL: ${APP_CONTEXT.baseUrl}

Rules you MUST follow:
1. Generate ONLY JavaScript Playwright test code
2. Use @playwright/test
3. Use "${APP_CONTEXT.baseUrl}" as the base URL
4. One functionality = ONE test file
5. Use clear test.describe blocks per functionality
6. Use reliable selectors (data-test where possible)
7. No explanations, no markdown
8. Output ONLY valid runnable test code
`;
}

/**
 * ===============================
 * CORE GENERATION FUNCTION
 * ===============================
 */
async function generateTestFromPlan(planFile) {
  const planPath = path.join(TEST_PLANS_DIR, planFile);
  const functionalityName = path.basename(planFile, path.extname(planFile));

  const manualTestContent = fs.readFileSync(planPath, "utf-8");

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: buildSystemPrompt() },
      {
        role: "user",
        content: `
Manual test cases for functionality: "${functionalityName}"

${manualTestContent}
`
      }
    ],
    temperature: 0.2
  });

  const generatedCode = response.choices[0].message.content.trim();

  const outputFilePath = path.join(
    GENERATED_DIR,
    `${functionalityName}.spec.js`
  );

  fs.writeFileSync(outputFilePath, generatedCode, "utf-8");

  console.log(`✅ Generated test: ${outputFilePath}`);
}

/**
 * ===============================
 * ENTRY POINT
 * ===============================
 */
async function run() {
  const planFiles = fs
    .readdirSync(TEST_PLANS_DIR)
    .filter(file => file.endsWith(".md"));

  if (planFiles.length === 0) {
    console.warn("⚠️ No manual test plans found in test-plans/");
    return;
  }

  for (const planFile of planFiles) {
    await generateTestFromPlan(planFile);
  }

  console.log("🎉 All Playwright tests generated successfully");
}

run().catch(err => {
  console.error("❌ Test generation failed:", err);
  process.exit(1);
});
