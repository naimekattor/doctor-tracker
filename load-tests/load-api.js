/**
 * Controlled Concurrency Load Tester
 * Measures p50, p95, p99 latency, throughput, and error rate.
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000';
const TOTAL_REQUESTS = 100;
const CONCURRENCY = 10;

function calculatePercentile(sortedArray, percentile) {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, index)];
}

async function runLoadTest(endpoint, label) {
  console.log(`\nStarting load benchmark: ${label} (${endpoint})`);
  console.log(`Requests: ${TOTAL_REQUESTS} | Concurrency: ${CONCURRENCY} workers\n`);

  const latencies = [];
  let successCount = 0;
  let errorCount = 0;

  let requestIndex = 0;
  const startTime = performance.now();

  async function worker(workerId) {
    const clientIp = `203.0.113.${workerId + 10}`;
    while (requestIndex < TOTAL_REQUESTS) {
      requestIndex++;
      const t0 = performance.now();
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          headers: {
            'X-Forwarded-For': clientIp,
          },
        });
        const t1 = performance.now();
        latencies.push(t1 - t0);
        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (err) {
        errorCount++;
        latencies.push(performance.now() - t0);
      }
    }
  }

  // Launch concurrent workers with simulated worker IPs
  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i));
  await Promise.all(workers);

  const totalDuration = (performance.now() - startTime) / 1000;
  latencies.sort((a, b) => a - b);

  const p50 = calculatePercentile(latencies, 50).toFixed(2);
  const p90 = calculatePercentile(latencies, 90).toFixed(2);
  const p95 = calculatePercentile(latencies, 95).toFixed(2);
  const p99 = calculatePercentile(latencies, 99).toFixed(2);
  const throughput = (successCount / totalDuration).toFixed(1);

  console.log('----------------------------------------------------');
  console.log(`BENCHMARK RESULTS: ${label}`);
  console.log('----------------------------------------------------');
  console.log(`Total Requests:   ${TOTAL_REQUESTS}`);
  console.log(`Successful:       ${successCount}`);
  console.log(`Failed / Blocked: ${errorCount}`);
  console.log(`Total Time:       ${totalDuration.toFixed(2)}s`);
  console.log(`Throughput:       ${throughput} req/sec`);
  console.log(`p50 Latency:      ${p50} ms`);
  console.log(`p90 Latency:      ${p90} ms`);
  console.log(`p95 Latency:      ${p95} ms`);
  console.log(`p99 Latency:      ${p99} ms`);
  console.log('----------------------------------------------------');

  return { throughput, p50, p95, p99, errorCount };
}

async function main() {
  console.log('====================================================');
  console.log('    DOCTOR TRACKER — LOCAL CONTROLLED LOAD TEST     ');
  console.log('====================================================');

  await runLoadTest('/api/doctors?page=1&limit=10', 'Doctors Directory (Indexed Read)');
  await runLoadTest('/api/health', 'Gateway Health & Database Ping');
}

main().catch(console.error);
