#!/usr/bin/env node

/**
 * Mode Enforcement Validation Script
 * 
 * Tests that the agent mode system properly blocks test execution in generator mode
 * and allows it in healer mode.
 */

const { spawn } = require('child_process');

console.log('🔍 Testing Agent Mode Enforcement System...\n');

/**
 * Test a command with a specific mode
 */
function testCommand(mode, command, args, shouldSucceed) {
  return new Promise((resolve) => {
    console.log(`Testing ${mode} mode: ${command} ${args.join(' ')}`);
    
    const env = { 
      ...process.env, 
      PLAYWRIGHT_AGENT_MODE: mode 
    };
    
    const proc = spawn(command, args, { 
      env,
      stdio: 'pipe',
      shell: true 
    });
    
    let output = '';
    proc.stdout.on('data', (data) => output += data.toString());
    proc.stderr.on('data', (data) => output += data.toString());
    
    proc.on('close', (code) => {
      const success = code === 0;
      const expected = shouldSucceed ? 'PASS' : 'BLOCK';
      const actual = success ? 'PASS' : 'BLOCK';
      const status = (expected === actual) ? '✅' : '❌';
      
      console.log(`  ${status} Expected: ${expected}, Got: ${actual}`);
      if (output.includes('Generator Agent Mode') || output.includes('Healer Agent Mode') || output.includes('blocked')) {
        console.log(`  📝 Message: ${output.split('\n')[0]}`);
      }
      console.log('');
      
      resolve(expected === actual);
    });
  });
}

/**
 * Run validation tests
 */
async function validateModeEnforcement() {
  const tests = [
    // Generator mode should block test execution
    { mode: 'generator', cmd: 'node', args: ['playwright.config.js'], shouldSucceed: false },
    { mode: 'generator', cmd: 'node', args: ['run-tests-with-report.js', '--help'], shouldSucceed: false },
    
    // Healer mode should allow test execution setup
    { mode: 'healer', cmd: 'node', args: ['playwright.config.js'], shouldSucceed: true },
    { mode: 'healer', cmd: 'node', args: ['-e', 'console.log("Healer mode test")'], shouldSucceed: true },
    
    // Generator mode should allow code generation
    { mode: 'generator', cmd: 'node', args: ['-e', 'console.log("Generator mode test")'], shouldSucceed: true }
  ];
  
  let passed = 0;
  let total = tests.length;
  
  for (const test of tests) {
    const result = await testCommand(test.mode, test.cmd, test.args, test.shouldSucceed);
    if (result) passed++;
  }
  
  console.log('='.repeat(50));
  console.log(`📊 Validation Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('✅ Mode enforcement system is working correctly!');
    console.log('🔸 Generator mode properly blocks test execution');
    console.log('🔹 Healer mode allows test execution');
  } else {
    console.log('❌ Mode enforcement system has issues');
    console.log('🔧 Check the configuration and scripts');
  }
  
  return passed === total;
}

// Run validation
validateModeEnforcement()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('❌ Validation failed:', err);
    process.exit(1);
  });