# MoneyBeing - Loan Eligibility & Lead Management Module

A full-stack, enterprise-grade Loan Eligibility Evaluation and Lead Management System built with **Python FastAPI** and **Next.js 14**. The platform features a database-driven Business Rule Engine (BRE), credit bureau score integration with failover simulation, duplicate lead prevention, JWT-authenticated Admin Panel, interactive analytics charts, live BRE rule editor, Excel export, unit tests, and Docker setup.

---

## 🌟 Key Features & Module Overview

### Module 1: Customer Loan Application Form
- Responsive, modern glassmorphic application form.
- Captures Customer Details (*Full Name, Mobile Number, Email ID, Date of Birth, City, Pincode*) and Loan Details (*Loan Type, Employment Type, Monthly Income, Loan Amount Required, Property Value*).
- Live Loan-to-Value (LTV) calculation pill showing real-time eligibility feedback.
- Mandatory consent checkbox and validation.

### Module 2: Credit Score Integration
- Integrates Credit Bureau Score service with graceful failover mechanism.
- Fallback algorithm deterministically generates realistic CIBIL scores (range 580–840) based on income and applicant profile if external API is unreachable.
- Fetched score is displayed to applicant and stored in the database.

### Module 3: Business Rule Engine (BRE)
- **Zero hardcoding**: All BRE rules are stored in the database (`bre_rules` table).
- Dynamic evaluator evaluates active rules at runtime (e.g., `Age >= 21`, `Age <= 60`, `Monthly Income >= 30,000`, `Credit Score >= 700`, `Loan Amount <= 80% Property Value`).
- Displays immediate status (**Eligible** or **Not Eligible**) with a detailed breakdown of exact rejection reasons.

### Module 4: Admin Panel & Dashboard
- Secure JWT-authenticated login.
- Real-time Analytics Dashboard displaying *Total Leads*, *Eligible Leads*, *Rejected Leads*, *Approval Rate %*, and *Average Credit Score*.
- Bonus interactive charts: Leads distribution by Loan Type & Top Rejection Reasons frequency breakdown.

### Module 5: Lead Management
- Paginated table showing *Lead ID*, *Customer Name*, *Mobile*, *Loan Type*, *Credit Score*, *BRE Status*, and *Created Date*.
- Search bar (by Name, Mobile, Email, City) and filter dropdowns (by Loan Type & BRE Status).
- Lead Detail Modal to inspect full applicant payload.
- **Bonus**: One-click **Export to Excel (.xlsx)** download button.

### Module 6: BRE Management Interface
- Interactive UI where Admin can **Add new BRE rules**, **Edit rules**, **Delete rules**, and **Toggle active/inactive state**.
- Rule changes immediately impact future evaluations without restarting the backend or editing code.

### Module 7: REST API & Documentation
- Clean RESTful endpoints for Lead creation (`POST /api/leads`), Admin Lead listing (`GET /api/leads`), Dashboard statistics (`GET /api/leads/stats`), BRE Rule CRUD (`/api/rules`), and Auth (`/api/auth/login`).
- Auto-generated Swagger OpenAPI docs available at `http://localhost:8000/docs`.

### Module 8: Duplicate Lead Validation
- Checks if applicant mobile number already exists in the database.
- Returns structured duplicate lead warning (`"Lead already exists"`) to prevent duplicate entries.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.13, FastAPI, SQLAlchemy ORM, Pydantic v2, Passlib/Bcrypt, Pytest, OpenPyXL.
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Database**: SQLite (default local zero-config runtime) / PostgreSQL (`schema.sql` dump provided).
- **Authentication**: JWT (JSON Web Tokens).
- **DevOps**: Docker, Docker Compose, Postman Collection.

---

## 🚀 Quick Start & Installation Guide

### Prerequisites
- Python 3.10+
- Node.js v18+ & NPM
- Docker & Docker Compose (optional for containerized run)

---

### Option 1: Local Development Setup (Recommended)

#### 1. Backend Setup
```bash
# Navigate to project root
cd c:\Users\kk707\Desktop\new_assessment

# Install Python dependencies
python -m pip install -r backend/requirements.txt

# Run Database Seed (Creates Admin & Default BRE Rules)
python backend/seed.py

# Start FastAPI server
python -m uvicorn backend.main:app --reload --port 8000
```
- **API Base URL**: `http://localhost:8000`
- **Swagger Documentation**: `http://localhost:8000/docs`

#### 2. Frontend Setup
Open a new terminal window:
```bash
cd c:\Users\kk707\Desktop\new_assessment\frontend

# Install NPM dependencies
npm install

# Start Next.js development server
npm run dev
```
- **Frontend URL**: `http://localhost:3000`

---

### Option 2: Run with Docker Compose

To start PostgreSQL, FastAPI, and Next.js in containerized mode:
```bash
docker-compose up --build
```
- Frontend will be available at `http://localhost:3000`
- Backend API will be available at `http://localhost:8000`

---

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

*(You can also click "Auto-fill Demo Credentials" on the Admin Login page `/admin/login`)*

---

## 🧪 Running Automated Unit Tests

Run the backend `pytest` test suite:
```bash
python -m pytest backend/tests/test_api.py -v
```
Tests cover health checks, lead creation, BRE evaluation, duplicate prevention, and JWT authentication.

---

## 📁 Project Directory Structure

```
new_assessment/
├── backend/
│   ├── main.py              # FastAPI main application & middleware
│   ├── database.py          # SQLAlchemy connection & session manager
│   ├── models.py            # Lead, BRERule, User DB models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── seed.py              # Initial DB seed script
│   ├── requirements.txt     # Backend dependencies
│   ├── Dockerfile           # Backend container definition
│   ├── routers/             # API route handlers (auth, leads, rules)
│   ├── services/            # Business logic (BRE engine, credit score, auth)
│   └── tests/               # Pytest automated test suite
├── frontend/
│   ├── src/app/             # Next.js App Router pages (Application, Admin)
│   ├── src/components/      # Reusable UI components (Navbar)
│   ├── src/lib/             # API client helper
│   ├── Dockerfile           # Frontend container definition
│   └── package.json
├── schema.sql               # PostgreSQL / MySQL database dump
├── postman_collection.json  # Postman API Collection
├── docker-compose.yml       # Container orchestration configuration
└── README.md                # Project documentation
```

---

## 📽️ Screen Recording Script Outline (3–5 Min)

1. **Introduction (30s)**: Overview of MoneyBeing Loan Eligibility & BRE system built with FastAPI and Next.js.
2. **Customer Application Flow (1m)**: Demonstrate applicant form, dynamic LTV ratio calculation, submitting loan details, real-time credit score fetch, and BRE eligibility response.
3. **Duplicate Prevention Demo (30s)**: Re-submit application with same mobile number to show duplicate validation.
4. **Admin Dashboard & Analytics (1m)**: Login as admin (`admin` / `admin123`), review total/eligible/rejected lead stats, interactive charts, searchable lead table, and Excel export.
5. **Dynamic BRE Rule Editor (1m)**: Demonstrate editing/adding a BRE rule (e.g. changing Credit Score cutoff from 700 to 750), submitting a new lead, and observing immediate evaluation changes without code modification.
