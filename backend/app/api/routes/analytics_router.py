from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.clustering_engine import generate_hotspots

router = APIRouter(prefix="/api/v1", tags=["Analytics & Geospatial Hotspots"])


@router.get(
    "/hotspots",
    response_model=Dict[str, Any],
    summary="Get Geospatial Demand Hotspots & AI Project Recommendations",
    description=(
        "Executes DBSCAN (haversine metric, 10km radius) over multi-channel citizen requests. "
        "Calculates a 3-factor Priority Index Score and synthesizes LLM project briefs formatted "
        "for Deck.gl scatter/heatmap layers and the AI Priority Projects panel."
    ),
)
async def get_hotspots_endpoint(
    radius_km: float = Query(
        10.0,
        ge=1.0,
        le=50.0,
        description="DBSCAN clustering epsilon radius in kilometers (5km - 10km standard)",
    ),
    min_samples: int = Query(
        1,
        ge=1,
        le=10,
        description="Minimum number of citizen signals required to form a cluster",
    ),
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Triggers geospatial clustering and Priority Index scoring, returning actionable hotspots.
    """
    results = await generate_hotspots(
        db=db,
        radius_km=radius_km,
        min_samples=min_samples,
    )
    return results
