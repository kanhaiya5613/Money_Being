import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.database import Base, get_db
from backend.main import app
from backend.seed import seed_db

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    seed_db(db_session=db)
    yield
    db.close()
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_create_lead_success():
    payload = {
        "full_name": "Karan Malhotra",
        "mobile": "9898989898",
        "email": "karan@example.com",
        "dob": "1990-01-01",
        "city": "Pune",
        "pincode": "411001",
        "loan_type": "Home Loan",
        "employment_type": "Salaried",
        "monthly_income": 85000,
        "loan_amount": 3500000,
        "property_value": 5000000,
        "consent": True
    }
    response = client.post("/api/leads", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "success"
    assert data["lead_id"] is not None
    assert data["credit_score"] >= 300
    assert data["bre_status"] == "Eligible"

def test_duplicate_lead_prevention():
    payload = {
        "full_name": "Karan Malhotra",
        "mobile": "9898989898",
        "email": "karan@example.com",
        "dob": "1990-01-01",
        "city": "Pune",
        "pincode": "411001",
        "loan_type": "Home Loan",
        "employment_type": "Salaried",
        "monthly_income": 85000,
        "loan_amount": 3500000,
        "property_value": 5000000,
        "consent": True
    }
    res1 = client.post("/api/leads", json=payload)
    assert res1.status_code == 201

    # Second request with same mobile number
    res2 = client.post("/api/leads", json=payload)
    assert res2.status_code == 400
    assert "Lead already exists" in res2.json()["detail"]

def test_admin_login():
    response = client.post("/api/auth/login", json={"username": "admin", "password": "admin123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["username"] == "admin"
