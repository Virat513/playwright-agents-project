#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * Script to run Playwright tests and automatically generate/serve HTML reports
 * Usage: node run-tests-with-report.js [test-file-pattern]
 * 
 * AGENT MODE ENFORCEMENT: Only runs in healer mode
 */

// Check agent mode before proceeding
const AGENT_MODE = process.env.PLAYWRIGHT_AGENT_MODE || 'healer';
if (AGENT_MODE === 'generator') {
  console.error('❌ Test execution blocked: Generator mode detected.');
  console.log('🔸 Generator Agent should only create test code, not run tests.');
  console.log('💡 To run tests, use healer mode: npm run heal:tests');
  process.exit(1);
}

console.log(`🔹 Healer Agent Mode: Running tests and generating reports...`);

const testPattern = process.argv[2] || 'generated/saucedemo-login.spec.js';
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const runId = process.env.PLAYWRIGHT_RUN_ID || `run-${timestamp}`;
const reportBaseDir = 'test-reports';
const htmlReportDir = `${reportBaseDir}/html/${runId}`;
const port = 9323;

console.log('🚀 Starting Playwright test execution with timestamped reporting...');
console.log(`📊 Run ID: ${runId}`);
console.log(`📁 Reports will be saved to: ${reportBaseDir}\n`);

// Ensure report directories exist
const dirs = [
  reportBaseDir,
  `${reportBaseDir}/html`,
  `${reportBaseDir}/allure`, 
  `${reportBaseDir}/json`,
  `${reportBaseDir}/junit`,
  `${reportBaseDir}/artifacts`,
  htmlReportDir
];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set environment variable for this test run
process.env.PLAYWRIGHT_RUN_ID = runId;

// Run Playwright tests
const testProcess = spawn('npx', ['playwright', 'test', testPattern, '--project=Microsoft Edge'], {
  stdio: 'inherit',
  shell: true
});

testProcess.on('close', (code) => {
  console.log(`\n📊 Test execution completed with exit code: ${code}`);
  console.log(`📊 Run ID: ${runId}\n`);
  
  // Check if HTML report was generated
  const reportIndexPath = path.join(htmlReportDir, 'index.html');
  
  if (fs.existsSync(reportIndexPath)) {
    console.log('✅ Timestamped HTML Test Report generated successfully!');
    console.log(`📁 Report location: ${path.resolve(htmlReportDir)}`);
    console.log(`🌐 Report URL: http://localhost:${port}`);
    console.log(`🔖 Run ID: ${runId} (for future reference)`);
    
    // List available report management commands
    console.log('\n💡 Report Management Commands:');
    console.log(`   npm run report:list          # List all reports`);
    console.log(`   npm run report:open          # Open latest report`);
    console.log(`   npm run report:open ${runId} # Open this specific report`);
    console.log(`   npm run report:allure        # Generate Allure report`);
    console.log(`   npm run report:clean         # Clean old reports`);
    
    // Serve the HTML report
    console.log('\n🌐 Starting HTML report server...');
    const serveProcess = spawn('npx', ['playwright', 'show-report', htmlReportDir, '--port', port.toString()], {
      stdio: 'inherit',
      shell: true
    });
    
    console.log(`\n🎉 HTML Report is now serving at: http://localhost:${port}`);
    console.log('📝 The report will automatically open in your default browser');
    console.log('🛑 Press Ctrl+C to stop the report server\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down report server...');
      serveProcess.kill('SIGTERM');
      process.exit(0);
    });
    
  } else {
    console.log('❌ HTML report generation failed or report not found');
    console.log(`Expected report at: ${path.resolve(htmlReportDir)}`);
    console.log('Check test execution for errors or configuration issues');
    console.log(`Run ID: ${runId}`);
    
    // Still show management commands for other reports
    console.log('\n💡 Check available reports:');
    console.log('   npm run report:list');
    process.exit(1);
  }
});

testProcess.on('error', (error) => {
  console.error('❌ Error running tests:', error);
  process.exit(1);
});