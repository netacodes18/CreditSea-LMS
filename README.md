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
cp .env.example .env    # optional, defaults to http://localhost:5000/api
npm run dev
```
*(Runs on `http://localhost:3000`)*

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
