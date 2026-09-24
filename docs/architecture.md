# Doctor Tracker — System Architecture & Topology

## 1. System Topology Overview

Doctor Tracker is built as a production-hardened healthcare administrative platform. It decouples a serverless/SSR Next.js frontend from an Express/Node.js API gateway, backed by MongoDB Atlas with a clear architectural roadmap for distributed scaling.

```text
                            PUBLIC INTERNET
                                  │
                                  ▼
                    ┌───────────────────────────┐
                    │      Cloudflare / CDN     │
                    │  (Edge Caching & TLS 1.3) │
                    └─────────────┬─────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       ┌─────────────────────┐        ┌───────────────────────┐
       │   Next.js Frontend  │        │   Node/Express API    │
       │   (App Router SSR)  │        │  (Healthcare Gateway) │
       └──────────┬──────────┘        └───────────┬───────────┘
                  │ HTTPS (REST / JSON)           │
                  └───────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
        ┌───────────────────────┐   ┌───────────────────────┐
        │     MongoDB Atlas     │   │   Distributed Cache   │
        │   (Document Store /   │   │  (Redis - Scaled Node)│
        │    Compound Indexes)  │   │  [In-Memory in Single]│
        └───────────────────────┘   └───────────────────────┘
```

---

## 2. API Request Lifecycle & Defense Pipeline

Every incoming HTTP request undergoes a multi-stage validation, sanitization, and authorization pipeline before touching controller logic or database operations:

```text
Incoming Request
       │
       ▼
 [1. Request Correlation]     Assigns or forwards 'X-Request-Id' for end-to-end tracing
       │
       ▼
 [2. Security Headers]        Helmet enforcement (HSTS, No-Sniff, Frameguard, Referrer)
       │
       ▼
 [3. Payload Limiter]         Enforces 1MB hard limit on JSON / urlencoded payloads
       │
       ▼
 [4. NoSQL Sanitizer]         Recursively inspects keys/values; blocks '$' and '.' operators
       │
       ▼
 [5. Tiered Rate Limiter]     Applies route-specific quota (Auth: 5/15m, Analytics: 30/1m, API: 120/1m)
       │
       ▼
 [6. Route Param Validation]  Strict Zod ObjectId regex verification (e.g. 24-char hex)
       │
       ▼
 [7. Query Parameter Filter]  Allowlisted attributes only; regex meta-characters escaped
       │
       ▼
 [8. Authentication & RBAC]   JWT verification + role authorization check (protect, authorize)
       │
       ▼
 [9. Controller & Services]   Mongoose query execution using compound indexes
       │
       ▼
 [10. Error Handling Gateway] Global error sanitizer: redacts internal stack in production
```

---

## 3. Data Flow Model

### Querying Clinical Records
1. Client sends `GET /api/doctors?specialization=Cardiology&page=1&limit=10&sort=-createdAt`.
2. Router verifies query parameters against `doctorQuerySchema`.
3. Sanitizer strips any operators or unexpected objects.
4. Controller escapes regex literals preventing ReDoS.
5. MongoDB executes query using indexed fields (`specialization: 1`, `createdAt: -1`), avoiding collection scans (`COLLSCAN` -> `IXSCAN`).
6. Paginated response payload returns metadata (`total`, `page`, `totalPages`, `count`) alongside documents.

### Mutations & Administrative Actions
1. Client transmits authenticated mutation (`POST /api/doctors`).
2. Gateway verifies `Bearer <token>` and enforces `role === 'admin'`.
3. Body is validated through strict Zod schema (`createDoctorSchema.strict()`).
4. Resource is persisted; HTTP 201 Created returned with created entity representation.
