from fastapi import APIRouter
from typing import Dict

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=Dict[str, str])
async def health_check() -> Dict[str, str]:
    """Health check endpoint for container orchestrators and monitoring."""
    return {"status": "CivicPulse BRICS Systems Active"}
