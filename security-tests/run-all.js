import { runNoSQLTests } from './nosql-injection.test.js';
import { runAuthMatrixTests } from './auth-matrix.test.js';
import { runRateLimitTests } from './rate-limit.test.js';
import { colors, BASE_URL } from './test-utils.js';

async function main() {
  console.log(`\n${colors.bold}${colors.blue}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}   DOCTOR TRACKER — AUTOMATED SECURITY TEST SUITE   ${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}====================================================${colors.reset}`);
  console.log(`${colors.dim}Target URL: ${BASE_URL}${colors.reset}\n`);

  // Check if server is running
  try {
    const health = await fetch(`${BASE_URL}/api/health`);
    if (!health.ok) {
      console.warn(`${colors.yellow}Warning: /api/health returned HTTP ${health.status}. Proceeding with tests...${colors.reset}`);
    } else {
      const data = await health.json();
      console.log(`${colors.green}✓ Connected to Doctor Tracker API:${colors.reset} ${data.message} (Database: ${data.database?.status || 'active'})`);
    }
  } catch (err) {
    console.error(`\n${colors.red}Error: Could not connect to API at ${BASE_URL}${colors.reset}`);
    console.error(`Please ensure the backend server is running (e.g. 'npm run dev' or 'node src/server.js').\n`);
    process.exit(1);
  }

  const startTime = Date.now();
  let totalPassed = 0;
  let totalTests = 0;

  const suite1 = await runNoSQLTests();
  totalPassed += suite1.passed;
  totalTests += suite1.total;

  const suite2 = await runAuthMatrixTests();
  totalPassed += suite2.passed;
  totalTests += suite2.total;

  const suite3 = await runRateLimitTests();
  totalPassed += suite3.passed;
  totalTests += suite3.total;

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n${colors.bold}----------------------------------------------------${colors.reset}`);
  console.log(`${colors.bold}SECURITY TEST REPORT SUMMARY${colors.reset}`);
  console.log(`----------------------------------------------------`);
  console.log(`Total Tests Run:  ${totalTests}`);
  console.log(`Passed:           ${colors.green}${totalPassed}${colors.reset}`);
  console.log(`Failed:           ${totalTests - totalPassed > 0 ? colors.red : colors.green}${totalTests - totalPassed}${colors.reset}`);
  console.log(`Execution Time:   ${duration}s`);
  console.log(`Overall Status:   ${totalPassed === totalTests ? colors.green + 'ALL TESTS PASSED ✓' : colors.red + 'FAILURES DETECTED ✗'}${colors.reset}`);
  console.log(`----------------------------------------------------\n`);

  process.exit(totalPassed === totalTests ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
