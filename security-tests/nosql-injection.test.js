import { BASE_URL, pass, fail, section, testFetch } from './test-utils.js';

export async function runNoSQLTests() {
  section('1. NoSQL Injection & Input Defense Suite');
  let passed = 0;
  let total = 0;

  // Test 1: Operator injection in auth body ($gt)
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: { $gt: '' },
        password: 'password123',
      }),
    });
    if (res.status === 400) {
      pass('Rejects NoSQL $gt operator in request body', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Rejects NoSQL $gt operator in request body', 'HTTP 400', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Rejects NoSQL $gt operator in request body', 'HTTP 400', err.message);
  }

  // Test 2: Operator injection in password field ($ne)
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@doctortracker.com',
        password: { $ne: null },
      }),
    });
    if (res.status === 400) {
      pass('Rejects NoSQL $ne operator in password field', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Rejects NoSQL $ne operator in password field', 'HTTP 400', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Rejects NoSQL $ne operator in password field', 'HTTP 400', err.message);
  }

  // Test 3: Query parameter object injection (?specialization[$gt]=)
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/doctors?specialization[$gt]=Cardiology`);
    if (res.status === 400) {
      pass('Rejects NoSQL operator in query parameters (?field[$gt]=)', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Rejects NoSQL operator in query parameters', 'HTTP 400', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Rejects NoSQL operator in query parameters', 'HTTP 400', err.message);
  }

  // Test 4: Query parameter un-allowlisted key or operator in sort
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/doctors?sort[$where]=sleep(1000)`);
    if (res.status === 400) {
      pass('Rejects $where injection attempt in query sort parameter', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Rejects $where injection attempt in query sort parameter', 'HTTP 400', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Rejects $where injection attempt in query sort parameter', 'HTTP 400', err.message);
  }

  // Test 5: ReDoS and special regex character escaping
  total++;
  try {
    const t0 = Date.now();
    const maliciousRegex = encodeURIComponent('((((((((a+)+)+)+)+)+)+)+)$');
    const res = await testFetch(`${BASE_URL}/api/doctors?search=${maliciousRegex}`);
    const duration = Date.now() - t0;
    if (res.status === 200 && duration < 1000) {
      pass('Safely escapes complex regex meta-characters without server hang (ReDoS immune)', `${duration}ms`);
      passed++;
    } else if (res.status === 400) {
      pass('Rejected malformed/excessive search regex query safely', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('ReDoS defense check', 'HTTP 200 in <1000ms or HTTP 400', `Status ${res.status}, took ${duration}ms`);
    }
  } catch (err) {
    fail('ReDoS defense check', 'Fast response', err.message);
  }

  return { passed, total };
}

if (process.argv[1]?.endsWith('nosql-injection.test.js')) {
  runNoSQLTests().then(({ passed, total }) => {
    process.exit(passed === total ? 0 : 1);
  });
}
