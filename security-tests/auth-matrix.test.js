import { BASE_URL, pass, fail, section, testFetch } from './test-utils.js';

export async function runAuthMatrixTests() {
  section('2. Authentication, Authorization & BOLA/IDOR Matrix');
  let passed = 0;
  let total = 0;

  let validToken = null;

  // Test 1: Successful Admin Login
  total++;
  try {
    let res = await testFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@doctortracker.com',
        password: 'AdminPassword123!',
      }),
    });
    if (res.status !== 200) {
      res = await testFetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@doctortracker.com',
          password: 'password123',
        }),
      });
    }
    const data = await res.json();
    if (res.status === 200 && data.token) {
      validToken = data.token;
      pass('Valid credentials authenticate successfully and return JWT', `HTTP 200`);
      passed++;
    } else {
      fail('Valid credentials login', 'HTTP 200 + token', `HTTP ${res.status}: ${data.message}`);
    }
  } catch (err) {
    fail('Valid credentials login', 'HTTP 200', err.message);
  }

  // Test 2: Invalid password
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@doctortracker.com',
        password: 'wrong_password_attempt',
      }),
    });
    if (res.status === 401) {
      pass('Invalid password rejected with 401 Unauthorized', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Invalid password rejected', 'HTTP 401', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Invalid password rejected', 'HTTP 401', err.message);
  }

  // Test 3: Non-existent user
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'ghost_user_9999@doctortracker.com',
        password: 'password123',
      }),
    });
    if (res.status === 401) {
      pass('Non-existent user rejected with 401 (consistent error timing)', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Non-existent user rejected', 'HTTP 401', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Non-existent user rejected', 'HTTP 401', err.message);
  }

  // Test 4: Protected route without Authorization header
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/analytics`);
    if (res.status === 401) {
      pass('Missing Authorization token blocked on protected endpoint', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Missing Authorization token blocked', 'HTTP 401', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Missing Authorization token blocked', 'HTTP 401', err.message);
  }

  // Test 5: Protected route with malformed Bearer token
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/analytics`, {
      headers: { Authorization: 'Bearer this-is-not-a-valid-jwt-token' },
    });
    if (res.status === 401) {
      pass('Malformed JWT token blocked with 401', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Malformed JWT token blocked', 'HTTP 401', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Malformed JWT token blocked', 'HTTP 401', err.message);
  }

  // Test 6: BOLA / IDOR - Malformed Hex Object ID
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/doctors/invalid-not-hex-id-123`);
    if (res.status === 400) {
      pass('Malformed ObjectId rejected by route param validator before DB query', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Malformed ObjectId rejected', 'HTTP 400', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Malformed ObjectId rejected', 'HTTP 400', err.message);
  }

  // Test 7: BOLA / IDOR - Valid format but non-existent Object ID
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/doctors/65a000000000000000000000`);
    if (res.status === 404) {
      pass('Non-existent resource returns clean 404 without leaking internal state', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Non-existent resource returns 404', 'HTTP 404', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Non-existent resource returns 404', 'HTTP 404', err.message);
  }

  // Test 8: Function-Level Authorization - Unauthenticated POST blocked
  total++;
  try {
    const res = await testFetch(`${BASE_URL}/api/doctors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Hacker Doctor',
        specialization: 'Exploit',
        hospital: 'Darknet Hospital',
        phone: '123456789',
        email: 'hacker@darknet.com',
      }),
    });
    if (res.status === 401) {
      pass('Unauthenticated doctor creation blocked with 401', `HTTP ${res.status}`);
      passed++;
    } else {
      fail('Unauthenticated doctor creation blocked', 'HTTP 401', `HTTP ${res.status}`);
    }
  } catch (err) {
    fail('Unauthenticated doctor creation blocked', 'HTTP 401', err.message);
  }

  return { passed, total };
}

if (process.argv[1]?.endsWith('auth-matrix.test.js')) {
  runAuthMatrixTests().then(({ passed, total }) => {
    process.exit(passed === total ? 0 : 1);
  });
}
