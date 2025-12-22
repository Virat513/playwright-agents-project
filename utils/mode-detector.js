/**
 * Agent Mode Detection Utility
 * 
 * Provides centralized mode detection and validation for Playwright AI Agents
 */

/**
 * Agent modes supported by the system
 */
export const AGENT_MODES = {
  PLANNER: 'planner',
  GENERATOR: 'generator', 
  HEALER: 'healer'
};

/**
 * Get current agent mode from environment
 * @returns {string} Current agent mode
 */
export function getCurrentMode() {
  return process.env.PLAYWRIGHT_AGENT_MODE || AGENT_MODES.HEALER;
}

/**
 * Check if current mode matches expected mode
 * @param {string} expectedMode - Expected agent mode
 * @returns {boolean} True if modes match
 */
export function isMode(expectedMode) {
  return getCurrentMode() === expectedMode;
}

/**
 * Check if test execution is allowed in current mode
 * @returns {boolean} True if tests can run
 */
export function canRunTests() {
  const mode = getCurrentMode();
  return mode === AGENT_MODES.HEALER;
}

/**
 * Check if test generation is allowed in current mode  
 * @returns {boolean} True if test generation can run
 */
export function canGenerateTests() {
  const mode = getCurrentMode();
  return mode === AGENT_MODES.GENERATOR || mode === AGENT_MODES.HEALER;
}

/**
 * Enforce mode restrictions with error messages
 * @param {string} requiredMode - Required mode for operation
 * @param {string} operation - Description of operation being attempted
 */
export function enforceMode(requiredMode, operation) {
  const currentMode = getCurrentMode();
  
  if (currentMode !== requiredMode) {
    console.error(`❌ Mode Violation: ${operation} requires '${requiredMode}' mode`);
    console.log(`🔄 Current mode: '${currentMode}'`);
    
    switch (requiredMode) {
      case AGENT_MODES.GENERATOR:
        console.log('💡 To generate tests: npm run generate:tests');
        break;
      case AGENT_MODES.HEALER:
        console.log('💡 To run/heal tests: npm run heal:tests');
        break;
      case AGENT_MODES.PLANNER:
        console.log('💡 Set mode for planning: npm run mode:set:planner');
        break;
    }
    
    process.exit(1);
  }
}

/**
 * Log current mode status
 */
export function logModeStatus() {
  const mode = getCurrentMode();
  const emoji = {
    [AGENT_MODES.PLANNER]: '🔹',
    [AGENT_MODES.GENERATOR]: '🔸', 
    [AGENT_MODES.HEALER]: '🔹'
  };
  
  console.log(`${emoji[mode]} Agent Mode: ${mode}`);
  
  switch (mode) {
    case AGENT_MODES.PLANNER:
      console.log('📝 Function: Generate manual test plans only');
      break;
    case AGENT_MODES.GENERATOR:
      console.log('⚙️  Function: Generate Playwright code only (no execution)');
      break;
    case AGENT_MODES.HEALER:
      console.log('🔧 Function: Run tests, debug failures, and heal broken tests');
      break;
  }
}