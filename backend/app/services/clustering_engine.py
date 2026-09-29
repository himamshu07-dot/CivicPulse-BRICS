import json
import math
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
from sklearn.cluster import DBSCAN
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.citizen_request import CitizenRequest
from app.services.ai_service import SYSTEM_PROMPT, generate_cluster_insight, format_llm_user_prompt

# Earth radius in kilometers for Haversine conversion
EARTH_RADIUS_KM = 6371.0088


def resolve_country_and_region(lat: float, lon: float) -> Tuple[str, str]:
    """Resolves BRICS country and specific municipal/administrative region from coordinates."""
    # São Paulo, Brazil (~ -23.55, -46.63)
    if -25.0 <= lat <= -21.0 and -48.0 <= lon <= -44.0:
        return ("Brazil", "São Paulo Metropolitan Area")
    # Sertão / Bahia / Northeast Brazil
    elif -18.0 <= lat <= 2.0 and -50.0 <= lon <= -34.0:
        return ("Brazil", "Sertão Semi-Arid Basin")
    # New Delhi / NCR, India (~ 28.61, 77.20)
    elif 27.5 <= lat <= 29.5 and 76.5 <= lon <= 78.5:
        return ("India", "National Capital Region (New Delhi)")
    # Marathwada / Western India
    elif 18.0 <= lat <= 21.0 and 74.0 <= lon <= 77.5:
        return ("India", "Marathwada Agricultural Basin")
    # Bihar / Eastern India
    elif 24.0 <= lat <= 28.0 and 83.0 <= lon <= 88.0:
        return ("India", "North Bihar Flood Corridor")
    # Cape Town / Western Cape, South Africa (~ -33.92, 18.42)
    elif -35.0 <= lat <= -32.5 and 17.5 <= lon <= 20.0:
        return ("South Africa", "Cape Town Peninsula District")
    # Eastern Cape, South Africa
    elif -34.0 <= lat <= -30.0 and 26.0 <= lon <= 30.0:
        return ("South Africa", "Eastern Cape Rural Clinics")
    # Yunnan / Southwest China
    elif 22.0 <= lat <= 28.0 and 99.0 <= lon <= 105.0:
        return ("China", "Yunnan Mountain Corridor")
    # Urals, Russia
    elif 54.0 <= lat <= 60.0 and 58.0 <= lon <= 64.0:
        return ("Russia", "Urals Industrial District")
    # Nile Delta, Egypt
    elif 29.0 <= lat <= 32.0 and 30.0 <= lon <= 33.0:
        return ("Egypt", "Upper Nile Canal Basin")
    # Ethiopia Highlands
    elif 7.0 <= lat <= 11.0 and 37.0 <= lon <= 41.0:
        return ("Ethiopia", "Rift Valley Highland Buffer")
    return ("BRICS Global", "Multilateral Strategic Zone")


def get_mock_population_density_score(lat: float, lon: float) -> float:
    """
    Heuristic representing local population density score (0 to 100).
    High scores for megacities (São Paulo, New Delhi) and dense corridors.
    """
    # High-density megacities & capital regions
    if (27.5 <= lat <= 29.5 and 76.5 <= lon <= 78.5) or (-25.0 <= lat <= -21.0 and -48.0 <= lon <= -44.0):
        return 98.0
    elif -35.0 <= lat <= -32.5 and 17.5 <= lon <= 20.0:
        return 92.0
    elif (20.0 <= lat <= 28.0 and 80.0 <= lon <= 90.0) or (29.0 <= lat <= 32.0 and 30.0 <= lon <= 33.0):
        return 95.0
    elif (-12.0 <= lat <= -6.0 and -45.0 <= lon <= -35.0) or (18.0 <= lat <= 21.0 and 73.0 <= lon <= 77.0):
        return 90.0
    return 80.0


def get_mock_infrastructure_deficit_score(lat: float, lon: float, category: str) -> float:
    """
    Baseline score representing existing infrastructure deficits in that sector (0 to 100).
    """
    cat_weights = {
        "Water & Sanitation": 96.0,
        "Healthcare": 95.0,
        "Grid & Power": 91.0,
        "Transport & Logistics": 88.0,
        "Education": 76.0,
    }
    return cat_weights.get(category, 85.0)


def calculate_priority_index(
    volume_count: int,
    lat: float,
    lon: float,
    category: str,
) -> float:
    """
    Calculates the composite 3-factor Priority Index Score out of 100:
    - Volume (Weight: 40%)
    - Population Density (Weight: 30%)
    - Infrastructure Deficit (Weight: 30%)
    """
    # 15 requests represents saturation in a cluster
    volume_score = min(100.0, (volume_count / 15.0) * 100.0)
    density_score = get_mock_population_density_score(lat, lon)
    deficit_score = get_mock_infrastructure_deficit_score(lat, lon, category)

    priority_score = (0.40 * volume_score) + (0.30 * density_score) + (0.30 * deficit_score)
    return round(min(100.0, max(0.0, priority_score)), 1)


async def fetch_citizen_records(db: Optional[AsyncSession]) -> List[Dict[str, Any]]:
    """
    Fetches citizen requests from PostgreSQL/PostGIS.
    If database has fewer than 10 records, loads from the seeded JSON catalog.
    """
    records: List[Dict[str, Any]] = []

    # 1. Query live database if session provided
    if db is not None:
        try:
            stmt = select(CitizenRequest).where(
                CitizenRequest.latitude.isnot(None),
                CitizenRequest.longitude.isnot(None),
            )
            result = await db.execute(stmt)
            db_records = result.scalars().all()
            for r in db_records:
                records.append({
                    "id": str(r.id),
                    "lat": float(r.latitude),
                    "lon": float(r.longitude),
                    "lang": r.original_language,
                    "cat": r.category,
                    "text": r.original_text or "",
                    "trans": r.english_translation,
                })
        except Exception:
            records = []

    # 2. If DB records are empty or small, load from seeded catalog
    if len(records) < 10:
        json_path = Path(__file__).parent.parent / "data" / "seeded_requests.json"
        if json_path.exists():
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    seeded = json.load(f)
                    for item in seeded:
                        records.append({
                            "id": item.get("id"),
                            "lat": item.get("latitude"),
                            "lon": item.get("longitude"),
                            "lang": item.get("original_language"),
                            "cat": item.get("category"),
                            "text": item.get("original_text"),
                            "trans": item.get("english_translation"),
                        })
            except Exception:
                pass

    return records


async def generate_hotspots(
    db: Optional[AsyncSession] = None,
    radius_km: float = 10.0,
    min_samples: int = 2,
) -> Dict[str, Any]:
    """
    Executes DBSCAN geospatial clustering on citizen requests:
    1. Converts coordinates to radians for the Haversine metric (eps = radius_km / 6371km).
    2. Groups points into localized clusters.
    3. Computes the 3-factor Priority Index Score (0-100).
    4. Invokes LLM prompt infrastructure advisor (generate_cluster_insight).
    5. Returns structured JSON matching the Next.js Deck.gl map & AI Priorities panel.
    """
    records = await fetch_citizen_records(db)
    if not records:
        return {"hotspots": [], "ai_projects": [], "clusters_count": 0, "total_signals": 0}

    # Extract coordinates as (Latitude, Longitude) for radians conversion
    coords = np.array([[r["lat"], r["lon"]] for r in records])
    coords_rad = np.radians(coords)

    # Calculate epsilon in radians: radius_km / Earth Radius
    epsilon_radians = radius_km / EARTH_RADIUS_KM

    # Run DBSCAN with Haversine metric
    dbscan = DBSCAN(eps=epsilon_radians, min_samples=min_samples, metric="haversine")
    labels = dbscan.fit_predict(coords_rad)

    clusters_map: Dict[int, List[Dict[str, Any]]] = {}
    for idx, label in enumerate(labels):
        if label not in clusters_map:
            clusters_map[label] = []
        clusters_map[label].append(records[idx])

    hotspots: List[Dict[str, Any]] = []
    ai_projects: List[Dict[str, Any]] = []

    cluster_counter = 1
    for label, cluster_items in clusters_map.items():
        # Exclude unclustered noise if -1 and has < 2 points
        if label == -1 and len(cluster_items) < 2:
            continue

        cluster_lats = [item["lat"] for item in cluster_items]
        cluster_lons = [item["lon"] for item in cluster_items]
        center_lat = float(np.mean(cluster_lats))
        center_lon = float(np.mean(cluster_lons))

        # Majority category
        categories = [item["cat"] for item in cluster_items if item["cat"] != "unclassified"]
        cluster_category = max(set(categories), key=categories.count) if categories else "Infrastructure"

        # Resolve country and region
        country_name, region_name = resolve_country_and_region(center_lat, center_lon)

        # Priority Index Score Calculation
        volume_count = len(cluster_items)
        priority_score = calculate_priority_index(volume_count, center_lat, center_lon, cluster_category)

        # Severity Alert Level
        severity = "alert-critical" if priority_score >= 85.0 else "alert-warn"
        urgency_level = "critical" if priority_score >= 90.0 else ("high" if priority_score >= 80.0 else "moderate")

        # LLM Policy Advisor Insight using the exact system prompt
        insight = generate_cluster_insight(cluster_items)
        project_title = insight.get("title", f"{cluster_category} Stabilization ({region_name})")
        ai_justification = insight.get("justification", "")

        cluster_id = f"hotspot-{cluster_counter:03d}"
        proj_id = f"proj-{cluster_counter:03d}"

        # Estimated facility & beneficiaries based on region scale
        est_cost = "$7.5M Multilateral Facility" if volume_count > 12 else "$3.8M Rapid DPG Co-Fund"
        beneficiaries = f"{volume_count * 120}K Citizens"
        timeframe = "60-Day Deployment" if volume_count > 12 else "30-Day Rapid Build"

        # 1. Deck.gl Map Format
        hotspot_item = {
            "id": cluster_id,
            "name": region_name,
            "country": country_name,
            "coordinates": [round(center_lon, 4), round(center_lat, 4)],  # [Longitude, Latitude]
            "severity": severity,
            "category": cluster_category,
            "demandScore": priority_score,
            "affectedPopulation": beneficiaries,
            "deficitDescription": ai_justification[:120] + "...",
            "signalCount": volume_count,
            "signals": [item["trans"] for item in cluster_items[:3]],
        }
        hotspots.append(hotspot_item)

        # 2. AI Priority Projects Panel Format
        project_item = {
            "id": proj_id,
            "title": project_title,
            "region": region_name,
            "country": country_name,
            "priorityScore": priority_score,
            "urgencyLevel": urgency_level,
            "estimatedCost": est_cost,
            "beneficiaries": beneficiaries,
            "timeframe": timeframe,
            "aiJustification": ai_justification,
            "keySignals": [
                f"{volume_count} verified citizen distress signals",
                f"High regional deficit weight in {cluster_category}",
                f"Multi-agency co-benefit rating 9.2/10",
            ],
            "coBenefits": [
                "Direct integration with BRICS DPG infrastructure",
                "Real-time IoT telemetry and citizen dispatch",
                "Open data public good governance",
            ],
            "hotspotId": cluster_id,
        }
        ai_projects.append(project_item)

        cluster_counter += 1

    # Sort descending by priority score
    hotspots.sort(key=lambda x: x["demandScore"], reverse=True)
    ai_projects.sort(key=lambda x: x["priorityScore"], reverse=True)

    return {
        "status": "success",
        "clusters_count": len(hotspots),
        "total_signals": len(records),
        "algorithm": "DBSCAN (Haversine metric, 10km radius)",
        "hotspots": hotspots,
        "ai_projects": ai_projects,
    }
