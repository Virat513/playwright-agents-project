/**
 * Utility functions for Playwright test reporting
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Generate and serve HTML report after test completion
 * @param {Object} testInfo - Playwright test info object
 */
export async function generateAndServeReport(testInfo) {
  const reportDir = 'playwright-report';
  const port = 9323;
  
  console.log('\n📊 Generating HTML test report...');
  
  try {
    // Wait a moment for report generation to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportIndexPath = path.join(reportDir, 'index.html');
    
    if (fs.existsSync(reportIndexPath)) {
      console.log('✅ HTML Test Report generated successfully!');
      console.log(`📁 Report location: ${path.resolve(reportDir)}`);
      console.log(`🌐 Report URL: http://localhost:${port}`);
      
      // Start the report server
      const command = `npx playwright show-report --port ${port}`;
      console.log('🌐 Starting HTML report server...');
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Error serving report:', error);
        } else {
          console.log('🎉 Report server started successfully!');
        }
      });
      
    } else {
      console.log('⚠️  HTML report not found. It may still be generating...');
    }
  } catch (error) {
    console.error('❌ Error in report generation:', error);
  }
}

/**
 * Add test metadata to the report
 * @param {Object} testInfo - Playwright test info object
 * @param {Object} metadata - Additional metadata to include
 */
export function addTestMetadata(testInfo, metadata = {}) {
  // Add custom annotations that will appear in the HTML report
  testInfo.annotations.push({
    type: 'Test Suite',
    description: 'SauceDemo Login Functionality Tests'
  });
  
  testInfo.annotations.push({
    type: 'Application',
    description: 'https://www.saucedemo.com/'
  });
  
  testInfo.annotations.push({
    type: 'Test Type',
    description: 'End-to-End Login Testing'
  });
  
  // Add any custom metadata
  Object.entries(metadata).forEach(([key, value]) => {
    testInfo.annotations.push({
      type: key,
      description: String(value)
    });
  });
}

/**
 * Log test execution summary
 * @param {Object} testInfo - Playwright test info object
 */
export function logTestSummary(testInfo) {
  const { title, status, duration, errors } = testInfo;
  
  console.log('\n' + '='.repeat(60));
  console.log(`📋 TEST SUMMARY: ${title}`);
  console.log('='.repeat(60));
  console.log(`Status: ${status === 'passed' ? '✅ PASSED' : status === 'failed' ? '❌ FAILED' : '⚠️ ' + status.toUpperCase()}`);
  console.log(`Duration: ${duration}ms`);
  
  if (errors && errors.length > 0) {
    console.log('Errors:');
    errors.forEach(error => console.log(`  - ${error.message}`));
  }
  
  console.log('='.repeat(60));
}