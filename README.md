# QuickHire — Backend API

A production-ready REST API for the QuickHire job board platform, built with **Node.js**, **Express**, **TypeScript**, **MongoDB**, and **Redis**. Features a modular architecture, JWT authentication with refresh tokens, rate limiting, email verification, and full unit test coverage.

---

## ✨ Features

- **Modular Architecture** — Separate modules for Auth, Jobs, and Applications
- **JWT Authentication** — Access token (1h) + Refresh token (7d) stored in Redis
- **Email Verification** — OTP-based verification on signup with 10-minute expiry
- **Forgot / Reset Password** — Secure token-based flow via email
- **Rate Limiting** — Per-endpoint rate limiting for signup, login, forgot password
- **Account Locking** — Auto-locks after repeated failed login attempts
- **Role-Based Access Control** — `superAdmin`, `admin`, `moderator`, `customer`, `seller`
- **Job Board API** — CRUD for jobs with search, filter, sort, and pagination
- **Application API** — Apply for jobs with duplicate-check guard
- **Redis Caching** — Token and verification data caching via Upstash Redis
- **Docker Support** — `docker-compose.yml` for local MongoDB + Redis
- **Unit Tests** — Jest test suites for Auth, Job, and Application services (66 tests)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Language | TypeScript 5 |
| Database | MongoDB via Mongoose 9 |
| Cache / Sessions | Redis (Upstash) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Email | Nodemailer (Gmail SMTP) |
| Validation | Zod |
| Testing | Jest, ts-jest |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### Installation

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section below)

# 4. (Optional) Seed the database
npm run seed

# 5. Start the development server
npm run dev
```

The API will be available at [http://localhost:4000](http://localhost:4000).

### Build for Production

```bash
npm run build       # compile TypeScript → dist/
node dist/server.js  # run compiled output
# or with PM2:
pm2 start ecosystem.config.js
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# ── Server   ──
PORT=4000
NODE_ENV=development           # development | production

# ── MongoDB   ─
MONGODB_URI=mongodb://127.0.0.1:27017/quickhire
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/quickhire

# ── JWT   ─────
JWT_ACCESS_SECRET=your_access_token_secret_here
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_refresh_token_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# ── Bcrypt   ──
BCRYPT_SALT_ROUNDS=8

# ── Redis (Upstash or local) ─────────────────────────────
REDIS_URL=rediss://default:<password>@<host>:6379
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_CACHE_KEY_PREFIX=quickhire

# Redis TTLs (seconds)
REDIS_TTL=3600
REDIS_TTL_ACCESS_TOKEN=3600
REDIS_TTL_REFRESH_TOKEN=604800

# ── Email (Gmail SMTP) ───────────────────────────────────
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password    # Gmail App Password (not your account password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_FROM=your_gmail@gmail.com

# ── Frontend URLs (CORS) ─────────────────────────────────
FRONTEND_URLS=http://localhost:3000,http://localhost:3001
RESET_PASS_UI_LINK=http://localhost:3000/reset-password/
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Port the server listens on |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_ACCESS_SECRET` | ✅ | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | ✅ | Secret for signing refresh tokens |
| `REDIS_URL` | ✅ | Full Redis connection URL |
| `EMAIL_USER` | ✅ | Gmail address for sending emails |
| `EMAIL_PASS` | ✅ | Gmail App Password (enable 2FA first) |
| `FRONTEND_URLS` | ✅ | Comma-separated allowed CORS origins |
| `BCRYPT_SALT_ROUNDS` | ⚠️ | Bcrypt rounds (default: 8) |
| `REDIS_CACHE_KEY_PREFIX` | ⚠️ | Prefix for Redis keys (default: `applylogger`) |

---

## 📡 API Endpoints

### Auth — `/api/v1/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | ❌ | Register new user |
| POST | `/verify-email` | ❌ | Verify email with OTP |
| POST | `/resend-verify-email` | ❌ | Resend verification OTP |
| POST | `/login` | ❌ | Login (returns access + refresh tokens) |
| POST | `/refresh-token` | Cookie | Rotate refresh token |
| POST | `/logout` | 🔒 | Invalidate refresh token |
| POST | `/forgot-password` | ❌ | Send password reset email |
| POST | `/reset-password` | ❌ | Reset password with token |
| PATCH | `/change-role` | 🔒 Admin | Change a user's role |
| GET | `/users` | 🔒 Admin | Get paginated user list |
| DELETE | `/users/:id` | 🔒 Super Admin | Delete a user |

### Jobs — `/api/v1/jobs`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | 🔒 Admin | Create a new job |
| GET | `/` | ❌ | Get all jobs (search, filter, paginate) |
| GET | `/:id` | ❌ | Get a single job by ID |
| DELETE | `/:id` | 🔒 Admin | Delete a job (also deletes applications) |

**Query params for GET `/jobs`:** `searchTerm`, `category`, `location`, `type`, `page`, `limit`, `sortBy`, `sortOrder`

### Applications — `/api/v1/applications`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | ❌ | Submit a job application |
| GET | `/job/:jobId` | 🔒 Admin | Get applications for a specific job |
| GET | `/` | 🔒 Admin | Get all applications |

---

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

Test suites:
- `Auth` — 34 tests (signup, verify email, login, forgot/reset password, refresh token, role change, delete user)
- `Job` — 14 tests (create, getAllJobs with filters/pagination, getById, delete)
- `Application` — 18 tests (create with duplicate guard, getByJobId, getAll)

---
