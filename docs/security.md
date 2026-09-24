# Doctor Tracker — Security Architecture & Threat Model

This document outlines the security controls, threat mitigations, and automated verification suites implemented across the Doctor Tracker platform, mapped directly against the **OWASP API Security Top 10**.

---

## 1. OWASP API Security Top 10 Mapping & Defenses

| OWASP Risk | Description | Doctor Tracker Mitigation | Verification Test |
| :--- | :--- | :--- | :--- |
| **API1:2023 Broken Object Level Authorization (BOLA)** | Attackers exploit endpoints that handle object identifiers to manipulate resources of other users. | All route identifiers (`:id`) pass through strict 24-character hexadecimal ObjectId regex validation before hitting the database. Malformed IDs are rejected immediately with HTTP 400; non-existent IDs return sanitized HTTP 404 without leaking internal state. | `security-tests/auth-matrix.test.js` |
| **API2:2023 Broken Authentication** | Compromised authentication mechanisms, missing token validation, credential brute-forcing. | Passwords hashed using bcrypt (`salt rounds = 10`). JWT tokens signed with HMAC-SHA256, verified on each protected request, expiring in 30 days. Strict auth rate-limiting (5 requests / 15 minutes per IP) protects `/api/auth/login`. | `security-tests/auth-matrix.test.js` & `rate-limit.test.js` |
| **API3:2023 Broken Object Property Level Authorization** | Exposing or manipulating sensitive entity attributes (Mass Assignment). | All input bodies validated via Zod with `.strict()`. Unexpected keys or query operators are rejected with HTTP 400. Model passwords excluded via `.select('-password')` by default. | `security-tests/nosql-injection.test.js` |
| **API4:2023 Unrestricted Resource Consumption** | Lack of rate limiting, unbounded page sizes, excessive request body sizes causing DoS. | Multi-tier rate limiting (`express-rate-limit`): Auth (5/15m), Analytics (30/1m), Mutations (60/1m), Global (120/1m). Payload limit capped at 1MB. Server-side pagination caps page limits at `100`. | `security-tests/rate-limit.test.js` |
| **API5:2023 Broken Function Level Authorization** | Lower privileged users accessing admin capabilities (e.g. creating/deleting records). | Role-Based Access Control (`authorize('admin')`) enforced on all doctor and patient mutation routes (`POST`, `PUT`, `DELETE`). | `security-tests/auth-matrix.test.js` |
| **API6:2023 Unrestricted Access to Sensitive Business Flows** | Automation / bots exploiting business logic repeatedly without throttling. | Authentication and registration endpoints enforce strict IP window counters with RFC-compliant `Retry-After` headers. | `security-tests/rate-limit.test.js` |
| **API7:2023 Server-Side Request Forgery (SSRF)** | Exploiting backend fetches to internal systems. | No client-supplied URLs are fetched by the backend service. | N/A (Architecture constraint) |
| **API8:2023 Security Misconfiguration** | Missing security headers, detailed stack traces leaked in responses, open CORS. | `helmet` middleware sets secure headers (HSTS, X-Content-Type-Options, Frameguard). Global error handler strips stack traces in production (`process.env.NODE_ENV === 'production'`). | Verified via HTTP headers inspection |
| **API9:2023 Improper Inventory Management** | Undocumented endpoints, legacy shadow APIs. | Centralized route definitions and single source of truth in `docs/api-contract.md`. | Verified via contract review |
| **API10:2023 Unsafe Consumption of APIs** | Blind trust in external services or client payloads. | Recursive NoSQL injection sanitizer inspects all bodies, queries, and params, immediately rejecting keys with `$` or `.`. Regex search strings escaped against ReDoS. | `security-tests/nosql-injection.test.js` |

---

## 2. NoSQL Injection & ReDoS Defense Details

### Prohibiting Query Operators
MongoDB query selectors like `$gt`, `$ne`, `$where`, or `$regex` can be smuggled via JSON bodies or parsed query strings (e.g. `?field[$gt]=value`).

Doctor Tracker applies a **Two-Tier Defense**:
1. **Sanitization Gateway (`sanitizeMiddleware.js`)**:
   Recursively inspects `req.body`, `req.query`, and `req.params`. Any key starting with `$` or containing `.` immediately halts the request with `HTTP 400 Bad Request`.
2. **Strict Zod Parsing (`doctorValidator.js`, `patientValidator.js`)**:
   Query parameters are validated against strict types (`z.string().trim().max(100)`). If an object is supplied instead of a string, Zod fails before the controller executes.
3. **Regex Meta-Character Escaping (`regexUtils.js`)**:
   All text-search regex queries escape special symbols (`[.*+?^${}()|[\]\\]`), neutralizing nested repetition operators like `((a+)+)+$` that trigger catastrophic backtracking (ReDoS).

---

## 3. Running Automated Security Tests

Execute the automated security test suite against any running environment:

```bash
# Target local instance (default: http://localhost:5000)
npm run test:security

# Target custom or staging environment
TEST_API_URL=https://doctor-tracker-api.onrender.com npm run test:security
```

### Test Suite Scorecard:
- **Suite 1: NoSQL Injection & Input Defense**: 5 tests verifying operator rejection in bodies, queries, and sort parameters.
- **Suite 2: Auth Matrix & BOLA/IDOR**: 8 tests verifying JWT validation, role enforcement, and resource ID checks.
- **Suite 3: Rate Limiting & Resource Throttling**: 2 tests verifying standard `RateLimit` headers and burst-traffic 429 throttling.
