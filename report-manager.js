#!/usr/bin/env node

/**
 * Report Manager Utility
 * 
 * Manages timestamped test reports and provides easy access to generated reports
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_REPORT_DIR = 'playwright-report';
const ALLURE_RESULTS_DIR = 'allure-results';

/**
 * Check if reports exist
 */
function reportsExist() {
  const htmlExists = fs.existsSync(path.join(DEFAULT_REPORT_DIR, 'index.html'));
  const allureExists = fs.existsSync(ALLURE_RESULTS_DIR) && fs.readdirSync(ALLURE_RESULTS_DIR).length > 0;
  return { htmlExists, allureExists };
}



/**
 * Open HTML report in browser
 */
function openHtmlReport() {
  const { htmlExists } = reportsExist();
  
  if (!htmlExists) {
    console.log('❌ No HTML report found. Run tests first to generate reports.');
    return;
  }

  const htmlReportPath = path.join(DEFAULT_REPORT_DIR, 'index.html');
  console.log(`🌐 Opening HTML report`);
  console.log(`📁 Report path: ${path.resolve(htmlReportPath)}`);

  // Serve the HTML report
  const serveCommand = 'npx';
  const serveArgs = ['playwright', 'show-report', DEFAULT_REPORT_DIR, '--port', '9323'];

  const serve = spawn(serveCommand, serveArgs, {
    stdio: 'inherit',
    shell: true
  });

  console.log(`🎉 Report server started at: http://localhost:9323`);
  
  serve.on('close', (code) => {
    console.log(`Report server stopped with code: ${code}`);
  });
}

/**
 * Generate Allure report from results
 */
function generateAllureReport() {
  const { allureExists } = reportsExist();
  
  if (!allureExists) {
    console.log('❌ No Allure results found. Run tests first to generate Allure data.');
    return;
  }

  console.log(`📊 Generating Allure report from ${ALLURE_RESULTS_DIR}`);
  
  const outputDir = 'allure-report';
  const allureCommand = 'npx';
  const allureArgs = ['allure', 'generate', ALLURE_RESULTS_DIR, '--clean', '-o', outputDir];

  const allure = spawn(allureCommand, allureArgs, {
    stdio: 'inherit',
    shell: true
  });

  allure.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Allure report generated successfully`);
      console.log(`📁 Report location: ${path.resolve(outputDir)}`);
      console.log(`🌐 To serve: npx allure open ${outputDir}`);
    } else {
      console.log(`❌ Allure report generation failed with code: ${code}`);
    }
  });
}

/**
 * List available reports
 */
function listReports() {
  const { htmlExists, allureExists } = reportsExist();
  
  if (!htmlExists && !allureExists) {
    console.log('📋 No reports found. Run tests first to generate reports.');
    return;
  }

  console.log('📋 Available Test Reports:');
  console.log('='.repeat(50));
  
  if (htmlExists) {
    const htmlPath = path.join(DEFAULT_REPORT_DIR, 'index.html');
    const stats = fs.statSync(htmlPath);
    console.log(`🌐 HTML Report: ✅`);
    console.log(`   Location: ${htmlPath}`);
    console.log(`   Created: ${stats.mtime.toLocaleString()}`);
    console.log('');
  }
  
  if (allureExists) {
    console.log(`📈 Allure Results: ✅`);
    console.log(`   Location: ${ALLURE_RESULTS_DIR}`);
    console.log(`   Files: ${fs.readdirSync(ALLURE_RESULTS_DIR).length} items`);
    console.log('');
  }

  console.log('💡 Usage:');
  console.log(`   View HTML report: npm run report:open`);
  console.log(`   Generate Allure report: npm run report:allure`);
}

/**
 * Clean all reports
 */
function cleanReports() {
  console.log('🧹 Cleaning test reports...');
  
  try {
    if (fs.existsSync(DEFAULT_REPORT_DIR)) {
      fs.rmSync(DEFAULT_REPORT_DIR, { recursive: true, force: true });
      console.log(`   ✅ Removed HTML reports: ${DEFAULT_REPORT_DIR}`);
    }
    
    if (fs.existsSync(ALLURE_RESULTS_DIR)) {
      fs.rmSync(ALLURE_RESULTS_DIR, { recursive: true, force: true });
      console.log(`   ✅ Removed Allure results: ${ALLURE_RESULTS_DIR}`);
    }
    
    if (fs.existsSync('allure-report')) {
      fs.rmSync('allure-report', { recursive: true, force: true });
      console.log(`   ✅ Removed Allure HTML report: allure-report`);
    }
    
    if (fs.existsSync('test-results')) {
      fs.rmSync('test-results', { recursive: true, force: true });
      console.log(`   ✅ Removed test artifacts: test-results`);
    }
    
    console.log('🧹 Cleanup completed successfully');
  } catch (error) {
    console.log(`❌ Cleanup error: ${error.message}`);
  }
}

// CLI Interface
const command = process.argv[2];

switch (command) {
  case 'list':
    listReports();
    break;
  case 'open':
    openHtmlReport();
    break;
  case 'allure':
    generateAllureReport();
    break;
  case 'clean':
    cleanReports();
    break;
  default:
    console.log('📊 Test Report Manager');
    console.log('');
    console.log('Usage: node report-manager.js <command>');
    console.log('');
    console.log('Commands:');
    console.log('  list      List all available reports');
    console.log('  open      Open HTML report');
    console.log('  allure    Generate Allure report');
    console.log('  clean     Clean all reports');
    console.log('');
    console.log('Examples:');
    console.log('  node report-manager.js list');
    console.log('  node report-manager.js open');
    console.log('  node report-manager.js allure');
    console.log('  node report-manager.js clean');
    break;
}