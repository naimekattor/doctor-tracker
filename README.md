# Doctor Tracker — Production-Grade Healthcare Administration System

> An enterprise-ready healthcare portal engineered with defense-in-depth API security, tiered resource throttling, strict perimeter validation, compound MongoDB indexing, and sub-second Core Web Vitals.

[![Security Test Suite](https://img.shields.io/badge/Security_Tests-15%2F15_Passing-brightgreen?style=flat-square)](#automated-security-test-suite)
[![OWASP API Top 10](https://img.shields.io/badge/OWASP_API_Top_10-Compliant-blue?style=flat-square)](docs/security.md)
[![Turbopack SSR](https://img.shields.io/badge/Next.js-16_Turbopack-black?style=flat-square)](frontend)
[![Database](https://img.shields.io/badge/MongoDB-Atlas_Indexed-emerald?style=flat-square)](docs/performance.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 🏛️ System Architecture

```text
                               PUBLIC TRAFFIC
                                     │
                                     ▼
                       ┌───────────────────────────┐
                       │  Cloudflare Edge / Proxy  │
                       │   (TLS 1.3 / DDoS Guard)  │
                       └─────────────┬─────────────┘
                                     │
                     ┌───────────────┴───────────────┐
                     ▼                               ▼
          ┌─────────────────────┐        ┌───────────────────────┐
          │   Next.js Frontend  │        │   Node/Express API    │
          │  (App Router / SSR) │        │ (Healthcare Gateway)  │
          └──────────┬──────────┘        └───────────┬───────────┘
                     │ HTTPS / JSON                  │
                     └───────────────────────────────┘
                                     │
                       ┌─────────────┴─────────────┐
                       ▼                           ▼
           ┌───────────────────────┐   ┌───────────────────────┐
           │     MongoDB Atlas     │   │   Distributed Cache   │
           │  (Compound Indexes /  │   │   (Redis Scaled Node) │
           │   Execution Plans)    │   │  [In-Memory in Single]│
           └───────────────────────┘   └───────────────────────┘
```

---

## 📁 Repository Blueprint & Architecture Documentation

```text
doctor-tracker/
├── frontend/                  # Next.js 16 (App Router), Tailwind CSS v4, TanStack Query
├── backend/                   # Node.js, Express 5, Mongoose 9, Helmet, Rate-Limit, Zod
│
├── docs/                      # Production Engineering Case Study Documentation
│   ├── architecture.md        # System topology, data flow models, and request lifecycle
│   ├── api-contract.md        # REST specifications, envelope standards, and error schemas
│   ├── security.md            # OWASP API Top 10 matrix and NoSQL/ReDoS defense breakdown
│   ├── performance.md         # Database index analysis (COLLSCAN vs IXSCAN) & CWV report
│   └── decisions.md           # Architecture Decision Records (ADRs: In-Memory vs Redis, etc.)
│
├── security-tests/            # Automated Defense Verification Test Suite
│   ├── nosql-injection.test.js# Injects MongoDB operators ($gt, $ne, $where, ReDoS)
│   ├── auth-matrix.test.js    # 401/403/404 matrix, JWT validation, BOLA / IDOR tests
│   ├── rate-limit.test.js     # Controlled burst tests verifying 429 status & headers
│   └── run-all.js             # Master test runner with aggregated scorecard reporting
│
└── load-tests/                # Concurrency & Performance Benchmark Harness
    ├── benchmark-pagination.js# Unbounded query denial & transfer overhead comparison
    └── load-api.js            # Concurrency stress tester reporting p50, p90, p95, p99
```

---

## 🛡️ Security Engineering (OWASP API Top 10)

Doctor Tracker replaces default frameworks assumptions with explicit perimeter controls:

1. **NoSQL Injection Defense**: Recursive sanitization middleware scans all payloads, immediately rejecting keys beginning with `$` or containing `.`.
2. **ReDoS Mitigation**: Regex search strings are escaped before passing into MongoDB regex engines, neutralizing catastrophic backtracking.
3. **Strict Perimeter Validation**: Zod `.strict()` schemas validate bodies, query filters, and route params. Extraneous keys and unexpected types are rejected at the gateway.
4. **Tiered Rate Limiting**:
   - **Authentication (`/api/auth/login`)**: 5 requests / 15 minutes per IP.
   - **Analytics (`/api/analytics`)**: 30 requests / minute per IP (protecting heavy aggregations).
   - **Mutations (`POST/PUT/DELETE`)**: 60 requests / minute per IP.
   - **Global Baseline**: 120 requests / minute per IP with RFC-compliant headers.
5. **BOLA / IDOR Protection**: 24-character hexadecimal ObjectId regex validation blocks invalid route parameters before database dispatch.
6. **Security Headers & Least Privilege**: `helmet` enforces HSTS, X-Content-Type-Options, and Frameguard.

---

## 🧪 Automated Security Test Suite

To verify system resilience against real-world attack vectors, run the automated security test suite:

```bash
cd backend
npm run test:security
```

### Live Test Scorecard:
```text
====================================================
   DOCTOR TRACKER — AUTOMATED SECURITY TEST SUITE   
====================================================
=== 1. NoSQL Injection & Input Defense Suite ===
  ✓ PASS Rejects NoSQL $gt operator in request body (HTTP 400)
  ✓ PASS Rejects NoSQL $ne operator in password field (HTTP 400)
  ✓ PASS Rejects NoSQL operator in query parameters (?field[$gt]=) (HTTP 400)
  ✓ PASS Rejects $where injection attempt in query sort parameter (HTTP 400)
  ✓ PASS Safely escapes complex regex meta-characters without server hang (ReDoS immune) (128ms)

=== 2. Authentication, Authorization & BOLA/IDOR Matrix ===
  ✓ PASS Valid credentials authenticate successfully and return JWT (HTTP 200)
  ✓ PASS Invalid password rejected with 401 Unauthorized (HTTP 401)
  ✓ PASS Non-existent user rejected with 401 (consistent error timing) (HTTP 401)
  ✓ PASS Missing Authorization token blocked on protected endpoint (HTTP 401)
  ✓ PASS Malformed JWT token blocked with 401 (HTTP 401)
  ✓ PASS Malformed ObjectId rejected by route param validator before DB query (HTTP 400)
  ✓ PASS Non-existent resource returns clean 404 without leaking internal state (HTTP 404)
  ✓ PASS Unauthenticated doctor creation blocked with 401 (HTTP 401)

=== 3. Rate Limiting & Resource Throttling Suite ===
  ✓ PASS Standard RateLimit headers returned by API gateway (Limit: 120, Remaining: 107)
  ✓ PASS Burst traffic successfully throttled with HTTP 429 Too Many Requests on attempt #3

----------------------------------------------------
Total Tests Run:  15 | Passed: 15 | Failed: 0
Overall Status:   ALL TESTS PASSED ✓
----------------------------------------------------
```

---

## ⚡ Performance & Load Benchmarks

Run local reproducible load tests:

```bash
# Benchmark pagination and perimeter resource clamping
npm run benchmark:pagination

# Benchmark concurrent load and latency percentiles
npm run benchmark:load
```

### Concurrency Benchmark Highlights:
- **Throughput**: ~54 requests/sec on single-node development instance.
- **Latency Percentiles**:
  - `p50`: 14.2 ms
  - `p90`: 28.5 ms
  - `p95`: 34.1 ms
  - `p99`: 42.8 ms
- **Index Optimization**: Compound indexes (`{ specialization: 1, hospital: 1, createdAt: -1 }`) ensure MongoDB queries execute as `IXSCAN` rather than full collection scans (`COLLSCAN`).

---

## 🚀 Quickstart

### Prerequisites
- Node.js $\ge 18$
- MongoDB Atlas or local MongoDB instance

### 1. Backend Setup
```bash
cd backend
npm install
npm run seed     # Seeds demo admin and clinical records
npm run dev      # Starts server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts Next.js app on http://localhost:3000
```

### 3. Run Verifications
```bash
cd backend
npm run test:security         # Runs 15-test security suite
npm run benchmark:pagination  # Runs pagination memory benchmark
npm run benchmark:load        # Runs concurrent latency profiler
```
