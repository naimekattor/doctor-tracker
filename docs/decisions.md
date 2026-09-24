# Architecture Decision Records (ADRs)

This document records key architectural and system design decisions made during the development of Doctor Tracker.

---

## ADR-001: In-Memory vs. Distributed (Redis) Rate Limiting

### Context
Rate limiting is required to protect authentication flows from credential stuffing and prevent expensive analytics aggregations from exhausting CPU/memory.
In our initial single-node cloud deployment (e.g. Render Web Service free tier), we evaluated two architectural strategies:
1. In-memory rate limiting via Node.js process memory.
2. Distributed rate limiting via an external Redis / Key-Value cluster.

### Decision
For the initial baseline deployment, we implement **In-Memory Rate Limiting** with standard headers (`Draft-8 RateLimit` format), while designing modular interfaces for a drop-in **Redis store adapter** (`rate-limit-redis`) when scaling horizontally.

### Architectural Trade-off Analysis
```text
           SINGLE NODE (Current)                        CLUSTERED (Scaled)
┌───────────────────────────────────────────┐   ┌───────────────────────────────────────────┐
│               Load Balancer               │   │               Load Balancer               │
│                     │                     │   │        ┌────────────┴────────────┐        │
│                     ▼                     │   │        ▼                         ▼        │
│             ┌───────────────┐             │   │ ┌───────────────┐       ┌───────────────┐ │
│             │ Node Instance │             │   │ │Node Instance A│       │Node Instance B│ │
│             └───────┬───────┘             │   │ └───────┬───────┘       └───────┬───────┘ │
│                     ▼                     │   │         └───────────┬───────────┘         │
│             ┌───────────────┐             │   │                     ▼                     │
│             │ In-Memory Map │             │   │             ┌───────────────┐             │
│             │  (Fast, 0ms)  │             │   │             │ Redis Cluster │             │
│             └───────────────┘             │   │             └───────────────┘             │
└───────────────────────────────────────────┘   └───────────────────────────────────────────┘
```

- **Pros of In-Memory (Current)**:
  - Zero network overhead (0ms latency, runs entirely in event-loop memory).
  - Eliminates extra cloud infrastructure cost and connection management.
  - Exactly fits single-instance hosting topologies.
- **Limitation**:
  - Memory state does not synchronize across multiple worker processes or horizontally scaled container replicas.
- **Migration Path to Clustered Deployments**:
  - When the service scales to $N > 1$ instances behind a load balancer, `express-rate-limit` will simply be configured with `store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) })`.

---

## ADR-002: Server-Side Strict Allowlist Pagination vs. Client-Side Slicing

### Context
Clinical datasets (doctors, patients) expand over time. Fetching entire collections to paginate on the client creates exponential memory bloat, high network transfer costs, and database connection saturation.

### Decision
All collection endpoints (`/api/doctors`, `/api/patients`) enforce **server-side cursor/skip-limit pagination**:
- Maximum `limit` capped at `100` via strict Zod validation schema.
- Default page size: `10`.
- All sort queries restricted to an allowlist (`['createdAt', '-createdAt', 'name', '-name', 'specialization', ...]`).
- Count and document retrieval executed in parallel via `Promise.all([find().skip().limit(), countDocuments()])`.

### Trade-offs
- **Benefit**: Predictable $O(1)$ memory payload on frontend and server regardless of whether the database contains 100 or 1,000,000 records.
- **Cost**: Requires two database operations (count + find), mitigated through compound index coverage (`{ createdAt: -1 }`).

---

## ADR-003: Defensive Zod Schema Parsing at the HTTP Boundary

### Context
Mongoose provides schema-level validation, but Mongoose validation runs *after* request parsing, controller logic execution, and often inside database query builders. Relying solely on database validation exposes controllers to unexpected types (e.g. objects where strings are expected, triggering NoSQL injection).

### Decision
We implement a **Defensive Boundary Architecture**:
- All incoming payloads (`req.body`, `req.query`, `req.params`) must pass through Zod schema validation before reaching controller handlers.
- Schemas strictly enforce `.strict()`, rejecting unmodeled properties.
- Type conversions are explicit via `z.coerce.number()`.

### Trade-offs
- **Benefit**: Complete separation of concerns: the HTTP transport layer guarantees valid data types to the business layer. Vulnerabilities like NoSQL operator injection and prototype manipulation are eliminated at the perimeter.
- **Cost**: Slight duplication of schema definitions between Zod and Mongoose, offset by type safety and perimeter security.
