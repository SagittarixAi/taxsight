"""TaxSight — AI-powered tax clarity. FastAPI application entry point."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, documents, calculations, summaries

app = FastAPI(
    title="TaxSight API",
    description="AI-powered tax document analysis and preparation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(calculations.router, prefix="/api/calculations", tags=["Calculations"])
app.include_router(summaries.router, prefix="/api/summaries", tags=["Summaries"])


@app.get("/health")
async def health_check():
    """Health check endpoint for Coolify/Render monitoring."""
    return {"status": "healthy", "service": "taxsight-api", "version": "1.0.0"}
