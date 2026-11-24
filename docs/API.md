# Bangladesh Prize Bond Platform - REST API Documentation

Base URL: `http://localhost:5000/api` (Production: `https://api.yourdomain.com/api`)

All requests and responses use JSON. Authenticated requests require the HTTP header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Register a new citizen user account.
- **Request Body**:
  ```json
  {
    "name": "Rafiqul Islam",
    "email": "rafiq@example.com",
    "password": "SecurePassword123!",
    "phone": "+8801700000000"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "6740a...",
        "name": "Rafiqul Islam",
        "email": "rafiq@example.com",
        "role": "user",
        "isEmailVerified": false
      }
    }
  }
  ```

### `POST /api/auth/login`
Authenticate with email and password.
- **Request Body**:
  ```json
  {
    "email": "rafiq@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "6740a...",
        "name": "Rafiqul Islam",
        "email": "rafiq@example.com",
        "role": "user"
      }
    }
  }
  ```

### `GET /api/auth/me`
Retrieve authenticated user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response** (`200 OK`): User object.

### `PUT /api/auth/profile`
Update user name, phone, or notification preferences.
- **Request Body**:
  ```json
  {
    "name": "Rafiqul Islam",
    "phone": "+8801711223344",
    "notificationPreferences": {
      "emailOnWin": true,
      "emailOnNewDraw": true
    }
  }
  ```

### `PUT /api/auth/change-password`
Change security password.
- **Request Body**:
  ```json
  {
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword123!"
  }
  ```

### `POST /api/auth/forgot-password`
Request password reset link.
- **Request Body**: `{"email": "rafiq@example.com"}`

### `POST /api/auth/reset-password`
Execute password reset with token.
- **Request Body**: `{"token": "raw_reset_token", "newPassword": "NewPassword123!"}`

---

## 2. Prize Bonds Endpoints (`/api/bonds`)
All bond endpoints require `Authorization: Bearer <token>`. Bonds are isolated strictly to the authenticated user.

### `GET /api/bonds`
List user's saved prize bonds with search, filtering, and pagination.
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 20)
  - `search`: Filter by 7-digit bond number or notes
  - `series`: Filter by specific series (e.g. `KA`, `KHA`)
  - `isEnabled`: Filter active/inactive (`true` / `false`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "bonds": [
        {
          "_id": "6740b...",
          "bondNumber": "0123456",
          "series": "all",
          "purchaseDate": "2026-01-01T00:00:00.000Z",
          "notes": "Purchased from Sonali Bank",
          "isEnabled": true
        }
      ],
      "total": 45,
      "page": 1,
      "limit": 20,
      "totalPages": 3
    }
  }
  ```

### `POST /api/bonds`
Add a single 7-digit prize bond.
- **Request Body**:
  ```json
  {
    "bondNumber": "0892211",
    "series": "all",
    "purchaseDate": "2026-02-15",
    "notes": "Gift from father"
  }
  ```

### `POST /api/bonds/bulk`
Bulk add multiple bond numbers with deduplication.
- **Request Body**:
  ```json
  {
    "bonds": [
      { "bondNumber": "0123456", "series": "all" },
      { "bondNumber": "0654321", "series": "KA" }
    ]
  }
  ```

### `POST /api/bonds/import-csv`
Upload a CSV file containing `bondNumber,series,purchaseDate,notes`.
- **Content-Type**: `multipart/form-data`

### `GET /api/bonds/export-csv`
Download all user's saved bonds as CSV.

### `PUT /api/bonds/:id`
Update an existing bond.

### `DELETE /api/bonds/:id`
Delete an existing bond.

---

## 3. Draws & Winning Numbers (`/api/draws`)

### `GET /api/draws`
List official draws. (Publicly available for verified draws; unverified draws visible to Admin).
- **Query Parameters**: `year`, `search`, `page`, `limit`.

### `GET /api/draws/:id`
Get draw details along with all winning numbers grouped by prize category.

### `POST /api/draws` *(Admin only)*
Create a new draw record in draft status.

### `POST /api/draws/:id/winning-numbers` *(Admin only)*
Add winning numbers for a draw.

### `POST /api/draws/:id/publish` *(Admin only)*
Publish & verify a draw. Automatically triggers the matching engine, saves matches, creates in-app alerts, and sends winner emails.

### `POST /api/draws/:id/trigger-match` *(Admin only)*
Manually re-run the matching engine for a draw.

---

## 4. Matching & Instant Checker (`/api/matching`)

### `POST /api/matching/check` *(Public / Unauthenticated & Authenticated)*
Check any bond numbers immediately without saving them to profile.
- **Request Body**:
  ```json
  {
    "numbers": ["0123456", "0892211"],
    "series": "ALL",
    "drawId": "all"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "wins": [
        {
          "bondNumber": "0123456",
          "series": "All",
          "prizeCategory": "first",
          "prizeAmount": 600000,
          "estimatedTax": 120000,
          "estimatedNet": 480000,
          "drawNumber": "118",
          "drawDate": "2026-04-30T00:00:00.000Z"
        }
      ],
      "totalChecked": 2,
      "totalWins": 1,
      "totalGross": 600000,
      "totalTax": 120000,
      "totalNet": 480000
    }
  }
  ```

### `GET /api/matching/history` *(Authenticated)*
Get user's official winning match records with pagination, search, category filters, and gross/tax/net summary.

---

## 5. Notifications (`/api/notifications`)
- `GET /api/notifications`: List user notifications and unread count.
- `PUT /api/notifications/:id/read`: Mark single notification as read.
- `PUT /api/notifications/read-all`: Mark all notifications as read.
- `DELETE /api/notifications/:id`: Delete notification.

---

## 6. Dashboard Stats (`/api/dashboard/stats`)
Returns user's aggregate stats:
- Total saved bonds, active bonds
- Total checked draws
- Total winning bonds
- Total estimated gross & net prize money
- Countdown to next scheduled Bangladesh Bank draw
- Latest published draw and recent notifications

---

## 7. Administrative APIs (`/api/admin`) *(Admin only)*
- `GET /api/admin/stats`: System-wide statistics.
- `GET /api/admin/users`: User management list.
- `PUT /api/admin/users/:id/role`: Update user role (`user` / `admin`).
- `GET /api/admin/jobs`: Background matching job execution history.
- `POST /api/admin/jobs/run-matcher`: Trigger matching engine for a draw.
- `GET /api/admin/email-logs`: Email delivery status logs.
- `POST /api/admin/email-logs/:id/retry`: Retry failed winner notification email.
- `GET /api/admin/audit-logs`: Administrative audit trail.
