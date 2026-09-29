from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api.routes import health, ingestion_router, analytics_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DBMS tables (SQLite / PostgreSQL)
    try:
        await init_db()
    except Exception as err:
        print(f"Database initialization notice: {err}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multilingual Digital Public Good platform backend for CivicPulse BRICS.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(ingestion_router.router)
app.include_router(analytics_router.router)

# Direct /health route as well for convenience
@app.get("/health", tags=["Health"])
async def root_health():
    return {"status": "CivicPulse BRICS Systems Active"}

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to CivicPulse BRICS API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
