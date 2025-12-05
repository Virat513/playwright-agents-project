import { createAgent } from "@playwright/test";
import OpenAI from "openai";
import * as fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * AGENT PROMPT
 * This agent reads a user story, generates acceptance criteria,
 * derives test scenarios, and outputs Playwright test code (TypeScript).
 */
const SYSTEM_PROMPT = `
You are an expert QA Automation Engineer specializing in Playwright.
Given a user story, you MUST output:

1. Acceptance Criteria
2. Test Scenarios (step-by-step instructions)
3. Playwright Test Code (TypeScript, for Playwright Test Runner)

Rules:
`;

/**
 * Generate test plan + code from user story
 */
async function generateTestPlan(userStory, agent) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userStory }
    ]
  });

  const result = response.choices[0].message.content;
  return result;
}

/**
 * Use Playwright Agent to validate & auto-fix generated tests
 */
async function runAndSelfCorrectTest(testCode, agent) {
  console.log("\n🚀 Running generated test through Playwright Agent...");

  const result = await agent.fixTest({
    code: testCode,
    language: "ts",
  });

  console.log("\n🤖 Agent Revised Test Code:\n");
  console.log(result.correctedCode);

  return result.correctedCode;
}

/**
 * MAIN FUNCTION
 */
async function main() {
  const userStory = `
As a user, I want to log into SauceDemo using valid credentials
so that I can access the products page.
`;

  console.log("📝 User Story:\n", userStory);

  // Initialize Playwright Test Agent
  const agent = await createAgent();

  // Step 1: Generate Test Plan + Code
  const plan = await generateTestPlan(userStory, agent);
  console.log("\n📋 Generated Test Plan:\n", plan);

  // Extract code block from LLM output
  const codeMatch = plan.match(/```ts([\s\S]*?)```/);
  if (!codeMatch) {
    console.error("❌ No TypeScript code block found.");
    process.exit(1);
  }
  let testCode = codeMatch[1].trim();

  // Step 2: Agent Self-Correct & Validate
  const corrected = await runAndSelfCorrectTest(testCode, agent);

  // Step 3: Save to file
  fs.writeFileSync("./generated/saucedemo-login.spec.ts", corrected);
  console.log("\n💾 Saved to: generated/saucedemo-login.spec.ts");

  console.log("\n🎉 Done!");
}

main();
