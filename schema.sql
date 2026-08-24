-- MoneyBeing Loan Eligibility & Lead Management Database Schema Dump
-- Engine: PostgreSQL / MySQL Compatible

-- Table: users (Admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: bre_rules (Business Rule Engine Rules)
CREATE TABLE IF NOT EXISTS bre_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    field_name VARCHAR(50) NOT NULL,
    operator VARCHAR(20) NOT NULL,
    target_field VARCHAR(50),
    value VARCHAR(50) NOT NULL,
    error_message VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: leads (Customer Applications & BRE Results)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL,
    dob VARCHAR(10) NOT NULL,
    city VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    loan_type VARCHAR(50) NOT NULL,
    employment_type VARCHAR(50) NOT NULL,
    monthly_income DOUBLE PRECISION NOT NULL,
    loan_amount DOUBLE PRECISION NOT NULL,
    property_value DOUBLE PRECISION NOT NULL,
    consent BOOLEAN DEFAULT TRUE,
    credit_score INTEGER NOT NULL,
    bre_status VARCHAR(20) NOT NULL,
    rejection_reasons TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast search and duplicate lookup
CREATE INDEX IF NOT EXISTS idx_leads_mobile ON leads(mobile);
CREATE INDEX IF NOT EXISTS idx_leads_bre_status ON leads(bre_status);
CREATE INDEX IF NOT EXISTS idx_leads_loan_type ON leads(loan_type);

-- Seed Data: Initial BRE Rules
INSERT INTO bre_rules (rule_name, field_name, operator, target_field, value, error_message, is_active)
VALUES 
    ('Minimum Applicant Age', 'age', '>=', NULL, '21', 'Applicant age must be at least 21 years', TRUE),
    ('Maximum Applicant Age', 'age', '<=', NULL, '60', 'Applicant age must not exceed 60 years', TRUE),
    ('Minimum Monthly Income', 'monthly_income', '>=', NULL, '30000', 'Monthly Income below minimum eligibility criteria (₹30,000)', TRUE),
    ('Minimum Credit Score', 'credit_score', '>=', NULL, '700', 'Credit Score below minimum requirement (700)', TRUE),
    ('Maximum Loan to Value (LTV)', 'loan_amount', '<=_pct_of', 'property_value', '80', 'Loan Amount exceeds eligible limit (80% of Property Value)', TRUE)
ON CONFLICT DO NOTHING;
