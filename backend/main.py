import sys
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database import engine, Base
from backend.seed import seed_db
from backend.routers import auth, leads, rules

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print("Initializing Database & Seeding Defaults...")
    Base.metadata.create_all(bind=engine)
    seed_db()
    yield
    # Shutdown logic
    print("Application shutdown clean.")

app = FastAPI(
    title="MoneyBeing Loan Eligibility & Lead Management API",
    description="REST API module for Loan Application submission, Credit Score integration, Database-driven BRE, Lead Management & Rule Configuration.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for local Next.js frontend, Vercel deployments, and Render
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

if not allowed_origins:
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth.router)
app.include_router(leads.router)
app.include_router(rules.router)

class MockCreditScoreRequest(BaseModel):
    mobile: str
    monthly_income: float

@app.post("/api/mock-credit-score", tags=["Credit Bureau API"])
def mock_credit_score_bureau(req: MockCreditScoreRequest):
    """
    Mock CIBIL Credit Bureau API endpoint for testing Credit Score Integration.
    Returns realistic credit score based on applicant income.
    """
    base_score = 660
    bonus = min(130, int(req.monthly_income / 1200))
    score = min(840, base_score + bonus)
    return {
        "status": "success",
        "mobile": req.mobile,
        "credit_score": score,
        "provider": "CIBIL Mock Credit Bureau"
    }

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "MoneyBeing Loan Eligibility & BRE API",
        "documentation": "/docs"
    }

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "*")
    return JSONResponse(
        status_code=500,
        content={"status": "error", "message": f"Internal Server Error: {str(exc)}"},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )
