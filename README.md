# Full-Stack Loan Management System (LMS)

A rigorous, full-stack, vertically integrated Loan Management System engineered with strict Role-Based Access Control (RBAC), ACID-compliant financial ledgers, Business Rule Engine (BRE) guards, and instantaneous CRM analytics.

## Tech Stack
*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Axios.
*   **Backend**: Node.js, Express, TypeScript, Multer, JWT (HTTP-Only Cookies).
*   **Database**: MongoDB (Mongoose ODMs, Aggregation Pipelines, Native Transactions).

## Architecture & Features

### 1. Robust Authentication & RBAC
The system utilizes strict, secure HTTP-only cookies for authentication, effectively mitigating local storage XSS vulnerabilities. 
Roles strictly partition backend endpoints and frontend UIs into siloed portals:
*   `BORROWER`: Can update their profile, evaluate eligibility, upload documents, and track loans/payments.
*   `SANCTION`: Bank staff authorized exclusively to approve or reject loan applications.
*   `DISBURSEMENT`: Financial staff authorized exclusively to trigger the physical release of funds.
*   `SALES`: Business staff authorized to view leads and CRM dashboards.
*   `ADMIN`: Superuser bridging Sanction, Disbursement, and Sales visibility.

### 2. Business Rule Engine (BRE)
Before originating a loan, the API strictly intercepts the borrower's profile.
To apply, a borrower must strictly be:
1. Between **23 and 50 years** of age.
2. Earning at least **₹25,000 / month**.
3. Passing strict **PAN format** evaluations (`^[A-Z]{5}[0-9]{4}[A-Z]$`).

### 3. Financial Integrity & ACID Ledgers
*   **Floating-Point Error Prevention**: All financial logic natively operates on the `paise` denomination mapping (Cents), preventing erratic JavaScript floating-point compounding errors during interest mapping.
*   **Mongoose Transactions**: Repayment operations rely on MongoDB's `.startSession()` hooks. If a ledger modification successfully registers a UTR but fails to deduct the borrower's balance, the entire database transaction gracefully rolls back.

### 4. Sales Dashboards
Instantly distills thousands of active system logs via MongoDB's `$aggregate` pipelines, returning high-level CRM metrics to the Sales UI instantly without overloading the Node process.

---

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (v5+) — Note: Ensure MongoDB is running as a Replica Set if you wish to leverage full ACID transactions in the Payments module.

### Backend Setup
```bash
cd server
npm install
cp .env.example .env   # then fill in MONGO_URI / JWT_SECRET
npm run seed            # creates one account per role (see Test Credentials below)
npm run dev
```
*(API runs on `http://localhost:5000`)*

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env    # optional, API_ORIGIN defaults to http://localhost:5000
npm run dev
```
*(Runs on `http://localhost:3000`)*

The browser never calls the Express server directly. `client/next.config.ts` proxies `/api/*` and `/uploads/*` to `API_ORIGIN`, so the app and API share one origin and the `httpOnly` auth cookie stays first-party.

---

## Deployment (Render + Vercel)

**1. MongoDB Atlas** — Network Access → allow `0.0.0.0/0` (Render has no fixed IP). Copy the connection string.

**2. API on Render** — New → Web Service → this repo.

| Setting | Value |
|---|---|
| Root Directory | `server` |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `npm run start:prod` |

Environment variables: `NODE_ENV=production`, `MONGO_URI=<atlas uri>`, `JWT_SECRET=<long random string>`, `CLIENT_URL=https://<your-app>.vercel.app`. Render provides `PORT`. Check `https://<service>.onrender.com/api/health`.

**3. Frontend on Vercel** — New Project → this repo → Root Directory `client` (Next.js is auto-detected). Environment variable: `API_ORIGIN=https://<service>.onrender.com`. Deploy, then put the Vercel URL into Render's `CLIENT_URL`.

**4. Seed (optional, wipes data)** — locally, with `MONGO_URI` in `server/.env` pointing at Atlas: `cd server && npm run seed`.

> Render's free tier sleeps after inactivity (first request takes ~30–50 s) and its filesystem is ephemeral, so uploaded salary slips are lost on redeploy or restart. For durable files, attach a Render persistent disk or move uploads to object storage.

---

## Test Credentials

Running `npm run seed` (from `server/`) drops all existing users and re-creates one account per role, all with the password **`password123`**:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password123` |
| Sales | `sales@example.com` | `password123` |
| Sanction | `sanction@example.com` | `password123` |
| Disbursement | `disbursement@example.com` | `password123` |
| Collection | `collection@example.com` | `password123` |
| Borrower | `borrower@example.com` | `password123` |

Admin can access every dashboard module; each other executive role is restricted to its own module (enforced on both frontend and backend); the Borrower account can only access the application portal.

### Demo borrowers (optional)

`npm run seed` creates the six role accounts above with empty data, which means the Sanction, Disbursement and Collection queues all start empty. To review those modules with realistic content, these demo borrowers can be created — one parked at each stage of the lifecycle (same password, `password123`):

| Email | Loan | Status | Useful for |
|---|---|---|---|
| `demo.applied@example.com` | ₹1,50,000 / 120 days | `APPLIED` | Sanction queue — approve or reject |
| `demo.sanctioned@example.com` | ₹2,50,000 / 180 days | `SANCTIONED` | Disbursement queue — record a payout |
| `demo.disbursed@example.com` | ₹1,00,000 / 90 days | `DISBURSED` | Collection — part-paid, balance outstanding |

Each has a completed profile, a passed eligibility check and an uploaded salary slip. A borrower registered without an application also appears as a lead on the Sales dashboard.
