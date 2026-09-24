export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

export const pass = (name, details = '') => {
  console.log(`  ${colors.green}✓ PASS${colors.reset} ${name} ${details ? colors.dim + '(' + details + ')' + colors.reset : ''}`);
  return true;
};

export const fail = (name, expected, actual) => {
  console.log(`  ${colors.red}✗ FAIL${colors.reset} ${name}`);
  console.log(`    ${colors.dim}Expected:${colors.reset} ${expected}`);
  console.log(`    ${colors.dim}Actual:  ${colors.reset} ${actual}`);
  return false;
};

export const section = (title) => {
  console.log(`\n${colors.bold}${colors.cyan}=== ${title} ===${colors.reset}`);
};

export const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

// Isolated simulated client IP per test runner invocation
export const SESSION_IP = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;

export const testFetch = (url, options = {}) => {
  const headers = {
    'X-Forwarded-For': options.ip || SESSION_IP,
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
};
