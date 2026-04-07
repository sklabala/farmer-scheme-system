# Deliverable 4: Test Cases & Test Scenarios

## 1. Overview

The test suite covers unit, integration, and end‑to‑end tests for the following layers:

1. **Authentication** – registration, OTP verification, token refresh, logout.
2. **Scheme** – list, filter, detail, search, pagination.
3. **Application** – apply, status updates, document handling.
4. **Notification** – creation, delivery, read/unread.
5. **Security** – rate limiting, input validation, auth guard.
6. **Performance** – response time & load.

All tests use `Jest` and `SuperTest` for API calls. Environment variables are read from `.env.test`.

## 2. Test Matrix

| # | Feature | Test ID | Description | Test Type | Expected Result |
|---|---------|---------|-------------|-----------|-----------------|
| 1 | Auth – Registration | TC‑A‑01 | Register new phone, valid phone format | Positive | 201 Created, OTP sent |
| 2 | Auth – Registration | TC‑A‑02 | Register duplicate phone | Negative | 409 Conflict, message “Exists” |
| 3 | Auth – OTP | TC‑A‑03 | Verify correct OTP | Positive | 200 OK, tokens returned |
| 4 | Auth – OTP | TC‑A‑04 | Wrong OTP | Negative | 400 Bad Request |
| 5 | Auth – Refresh | TC‑A‑05 | Refresh with valid token | Positive | 200 OK, new access token |
| 6 | Auth – Refresh | TC‑A‑06 | Refresh expired token | Negative | 401 Unauthorized |
| 7 | Auth – Logout | TC‑A‑07 | Logout with valid refresh token | Positive | 200 OK, token revoked |
| 8 | Scheme – List | TC‑S‑01 | Get list without filters | Positive | 200 OK, array of schemes |
| 9 | Scheme – List | TC‑S‑02 | Pagination (page 2) | Positive | 200 OK, correct page data |
|10 | Scheme – Filter | TC‑S‑03 | Filter by category & state | Positive | Schemes filtered correctly |
|11 | Scheme – Search | TC‑S‑04 | Full‑text search keyword | Positive | Schemes matched |
|12 | Scheme – Detail | TC‑S‑05 | Get by id (valid) | Positive | 200 OK, scheme data |
|13 | Scheme – Detail | TC‑S‑06 | Get by id (invalid) | Negative | 404 Not Found |
|14 | Application – Submit | TC‑AP‑01 | Apply to scheme (valid) | Positive | 201 Created, application id |
|15 | Application – Submit | TC‑AP‑02 | Apply duplicate | Negative | 409 Conflict |
|16 | Application – Status | TC‑AP‑03 | Get status (my apps) | Positive | 200 OK, list |
|17 | Notification – Create | TC‑N‑01 | Admin creates notification | Positive | 201 Created |
|18 | Notification – Deliver | TC‑N‑02 | SMS sent on defined event | Positive | 200 OK, message sent |
|19 | Security – Rate Limit | TC‑S‑R‑01 | Exceed request threshold | Negative | 429 Too Many Requests |
|20 | Security – Input Validation | TC‑S‑I‑01 | Malformed JSON | Negative | 400 Bad Request |

## 3. Example Jest Test (Authentication)
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        phoneNumber: '9123456789',
        name: 'Test User',
        state: 'Kerala',
        district: 'Ernakulam'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.message).toMatch(/OTP sent/i);
  });

  it('should not register duplicate phone', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        phoneNumber: '9123456789',
        name: 'Duplicate',
        state: 'Kerala',
        district: 'Ernakulam'
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toMatch(/already registered/i);
  });
});
```

## 4. Integration Test Flow (Postman) – Sample Collection
* **Collection**: `FarmerScheme_Api.postman_collection.json`
* **Environments**: `Dev`, `QA` with `baseUrl`, `accessToken`

### Requests
1. `POST /api/auth/register` – Register
2. `POST /api/auth/verify-otp` – Verify OTP
3. `GET /api/schemes` – List schemes
4. `POST /api/schemes/apply` – Apply
5. `GET /api/applications` – List user applications

Each request includes validation tests in Postman’s Tests tab:
```js
pm.expect(JSON.parse(responseBody).success).to.eql(true);
```

## 5. Performance Test (k6)
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 200,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500']
  }
};

export default function () {
  let res = http.get('https://api.farmerscheme.gov.in/api/schemes');
  check(res, { 'status was 200': r => r.status === 200 });
  sleep(1);
}
```

## 6. Acceptance Criteria
- All positive test cases return the correct HTTP status and payload.
- Negative cases provide meaningful error messages and appropriate status codes.
- Rate limits trigger at configured thresholds.
- Response times for 95th percentile stay below 200 ms in load tests.
- Unit tests cover at least 90 % of critical business logic.

---

For each new feature, add corresponding test cases in this file and link them to the relevant Jira issue for traceability.
