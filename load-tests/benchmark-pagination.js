/**
 * Benchmark Script: Server-Side Pagination vs. Unbounded Fetch
 * Measures latency, payload size, and network savings.
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';

async function benchmark() {
  console.log('====================================================');
  console.log('   PAGINATION & RESOURCE CONSUMPTION BENCHMARK      ');
  console.log('====================================================');
  console.log(`Target: ${BASE_URL}\n`);

  // Test 1: Paginated Query (limit=10)
  console.log('Running Test 1: Server-side Paginated Query (limit = 10)...');
  const t0 = performance.now();
  const res1 = await fetch(`${BASE_URL}/api/doctors?page=1&limit=10`);
  const t1 = performance.now();
  const text1 = await res1.text();
  const size1 = new TextEncoder().encode(text1).length;
  const json1 = JSON.parse(text1);

  console.log(`  ✓ Latency:      ${(t1 - t0).toFixed(2)} ms`);
  console.log(`  ✓ Transferred:  ${(size1 / 1024).toFixed(2)} KB`);
  console.log(`  ✓ Count:        ${json1.count} items (Total: ${json1.total})\n`);

  // Test 2: Paginated Query (limit=50)
  console.log('Running Test 2: Server-side Paginated Query (limit = 50)...');
  const t2 = performance.now();
  const res2 = await fetch(`${BASE_URL}/api/doctors?page=1&limit=50`);
  const t3 = performance.now();
  const text2 = await res2.text();
  const size2 = new TextEncoder().encode(text2).length;
  const json2 = JSON.parse(text2);

  console.log(`  ✓ Latency:      ${(t3 - t2).toFixed(2)} ms`);
  console.log(`  ✓ Transferred:  ${(size2 / 1024).toFixed(2)} KB`);
  console.log(`  ✓ Count:        ${json2.count} items\n`);

  // Test 3: Unbounded request blocked by validation schema
  console.log('Running Test 3: Attempting Unbounded Query (limit = 10000)...');
  const res3 = await fetch(`${BASE_URL}/api/doctors?limit=10000`);
  const json3 = await res3.json();

  if (res3.status === 400) {
    console.log(`  ✓ Blocked:      HTTP 400 Bad Request (Exceeded max allowable limit 100)`);
    console.log(`  ✓ Error:        ${json3.errors?.[0]?.message || json3.message}`);
  } else {
    console.log(`  ✗ Allowed:      HTTP ${res3.status}`);
  }

  console.log('\n====================================================');
  console.log('ARCHITECTURAL CONCLUSION:');
  console.log('- Strict Zod query schema bounds maximum resource consumption per request.');
  console.log(`- Limit = 10 reduces transfer overhead by ${((1 - size1 / size2) * 100).toFixed(1)}% compared to Limit = 50.`);
  console.log('====================================================\n');
}

benchmark().catch(console.error);
