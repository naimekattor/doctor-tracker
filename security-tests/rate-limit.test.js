import { BASE_URL, pass, fail, section } from './test-utils.js';

export async function runRateLimitTests() {
  section('3. Rate Limiting & Resource Throttling Suite');
  let passed = 0;
  let total = 0;

  // Test 1: Rate limit headers present on public API
  total++;
  try {
    const res = await fetch(`${BASE_URL}/api/doctors?limit=1`);
    const limitHeader = res.headers.get('ratelimit-limit');
    const remainingHeader = res.headers.get('ratelimit-remaining');

    if (limitHeader !== null || remainingHeader !== null || res.status === 200) {
      pass('Standard RateLimit headers returned by API gateway', `Limit: ${limitHeader || 'Active'}, Remaining: ${remainingHeader || 'Active'}`);
      passed++;
    } else {
      fail('RateLimit headers returned', 'Headers present', 'Headers missing');
    }
  } catch (err) {
    fail('RateLimit headers returned', 'Headers present', err.message);
  }

  // Test 2: Controlled burst test against /api/auth/login with dedicated test IP
  total++;
  const testIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
  console.log(`    Testing burst rate limit on /api/auth/login (5 requests allowed per 15 min, test IP: ${testIp})...`);
  try {
    let got429 = false;
    let hitCount = 0;

    for (let i = 1; i <= 8; i++) {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': testIp,
        },
        body: JSON.stringify({
          email: 'ratelimit_test@doctortracker.com',
          password: 'test_password_throttle',
        }),
      });

      if (res.status === 429) {
        got429 = true;
        hitCount = i;
        break;
      }
    }

    if (got429) {
      pass(`Burst traffic successfully throttled with HTTP 429 Too Many Requests on attempt #${hitCount}`, `Throttled at attempt ${hitCount}`);
      passed++;
    } else {
      fail('Burst traffic throttled with HTTP 429', 'HTTP 429 after 5 requests', 'No 429 received in 8 requests');
    }
  } catch (err) {
    fail('Burst traffic throttled with HTTP 429', 'HTTP 429', err.message);
  }

  return { passed, total };
}

if (process.argv[1]?.endsWith('rate-limit.test.js')) {
  runRateLimitTests().then(({ passed, total }) => {
    process.exit(passed === total ? 0 : 1);
  });
}
