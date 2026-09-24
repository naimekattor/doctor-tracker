# Doctor Tracker — REST API Contract & Specifications

## 1. Global Gateway Conventions

### Base URL
- Local: `http://localhost:5000/api`
- Production: `https://<deployed-domain>/api`

### Standard Request Headers
| Header | Type | Description |
| :--- | :--- | :--- |
| `Content-Type` | String | Must be `application/json` for mutations |
| `Authorization` | String | `Bearer <JWT_TOKEN>` for protected routes |
| `X-Request-Id` | UUID (Optional) | Client-supplied tracing identifier (generated if omitted) |

### Standard Response Envelope
All API endpoints return responses in a standardized JSON envelope:

#### Success Response
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": { ... }
}
```

#### Paginated Success Response
```json
{
  "success": true,
  "total": 120,
  "page": 1,
  "totalPages": 12,
  "count": 10,
  "data": [ ... ]
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

---

## 2. API Endpoints

### 🩺 Health & Diagnostics
#### `GET /api/health`
- **Auth**: Public
- **Description**: Gateway health and database readiness check
- **Response 200**:
  ```json
  {
    "success": true,
    "status": "healthy",
    "message": "Doctor Tracker API is operational",
    "uptime": 124.5,
    "database": { "status": "connected" }
  }
  ```

---

### 🔐 Authentication
Rate Limited: `5 requests / 15 minutes`

#### `POST /api/auth/register`
- **Auth**: Public
- **Body**: `{ email: string, password: string (min 6), role?: "admin" }`
- **Response 201**: `{ success: true, token: string, user: { id, email, role } }`

#### `POST /api/auth/login`
- **Auth**: Public
- **Body**: `{ email: string, password: string }`
- **Response 200**: `{ success: true, token: string, user: { id, email, role } }`
- **Response 401**: `{ success: false, message: "Invalid email or password" }`

#### `GET /api/auth/me`
- **Auth**: Protected (`Bearer <token>`)
- **Response 200**: `{ success: true, user: { id, email, role } }`

---

### 👨‍⚕️ Doctors Directory
Rate Limited: `120 requests / min` (Read), `60 requests / min` (Write)

#### `GET /api/doctors`
- **Auth**: Public
- **Query Parameters**:
  - `page`: Integer $\ge 1$ (Default: 1)
  - `limit`: Integer $1..100$ (Default: 10)
  - `search`: String $\le 100$ chars (searches name, specialization, hospital, email)
  - `specialization`: String $\le 100$ chars
  - `hospital`: String $\le 120$ chars
  - `sort`: Enum (`createdAt`, `-createdAt`, `name`, `-name`, `specialization`, `-specialization`, `hospital`, `-hospital`)
- **Response 200**: Paginated list of Doctor documents

#### `GET /api/doctors/:id`
- **Auth**: Public
- **Params**: `:id` (24-hex MongoDB ObjectId)
- **Response 200**: Doctor document with attached `patientCount`
- **Response 404**: `{ success: false, message: "Doctor not found" }`

#### `POST /api/doctors`
- **Auth**: Admin (`protect`, `authorize('admin')`)
- **Body**: `{ name, specialization, hospital, phone, email }`
- **Response 201**: Created Doctor document

#### `PUT /api/doctors/:id`
- **Auth**: Admin (`protect`, `authorize('admin')`)
- **Body**: Partial doctor fields
- **Response 200**: Updated Doctor document

#### `DELETE /api/doctors/:id`
- **Auth**: Admin (`protect`, `authorize('admin')`)
- **Response 200**: `{ success: true, message: "Doctor deleted successfully" }`
- **Response 400**: Rejects deletion if doctor has assigned patients

---

### 🏥 Patients Directory
Rate Limited: `120 requests / min` (Read), `60 requests / min` (Write)

#### `GET /api/patients`
- **Auth**: Public
- **Query Parameters**:
  - `page`, `limit`, `search`, `doctor` (ObjectId), `gender` (`Male`|`Female`|`Other`), `condition`, `sort`
- **Response 200**: Paginated list of Patient documents populated with doctor details

#### `GET /api/patients/:id`
- **Auth**: Public
- **Response 200**: Single Patient document

#### `POST /api/patients`
- **Auth**: Admin
- **Body**: `{ name, age, gender, condition, contactPhone, doctor }`
- **Response 201**: Created Patient document

#### `PUT /api/patients/:id`
- **Auth**: Admin
- **Response 200**: Updated Patient document

#### `DELETE /api/patients/:id`
- **Auth**: Admin
- **Response 200**: Deletion confirmation

---

### 📊 Analytics & Reporting
Rate Limited: `30 requests / min`

#### `GET /api/analytics`
- **Auth**: Protected (`protect`)
- **Response 200**:
  ```json
  {
    "success": true,
    "data": {
      "summary": { "totalDoctors": 10, "totalPatients": 50 },
      "specializationBreakdown": [ { "specialization": "Cardiology", "count": 4 } ],
      "genderBreakdown": [ { "gender": "Male", "count": 25 } ],
      "hospitalBreakdown": [ { "hospital": "City General", "count": 6 } ],
      "topDoctorsByPatients": [ ... ],
      "recentPatients": [ ... ]
    }
  }
  ```
