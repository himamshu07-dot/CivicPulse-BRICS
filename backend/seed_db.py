"""
CivicPulse BRICS - Database Seeding Script (seed_db.py)
Seeds 50 realistic, multilingual citizen requests across 3 distinct BRICS geospatial clusters:
1. São Paulo, Brazil (Transport, Urban Mobility & Drainage in Portuguese)
2. New Delhi, India (Water Access & Pipeline Depletion in Hindi)
3. Cape Town, South Africa (Electricity & Grid Blackouts in isiZulu/English)
"""

import asyncio
import json
import os
import random
import sys
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Ensure UTF-8 output on all operating systems
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Raw Multilingual Seed Templates
SAO_PAULO_SIGNALS = [
    {
        "pt": "Os ônibus da linha 875C estão demorando mais de 50 minutos no corredor da Rebouças.",
        "en": "Bus line 875C buses are delayed over 50 minutes on the Rebouças transit corridor.",
        "cat": "Transport & Logistics",
        "chan": "whatsapp",
    },
    {
        "pt": "Alagamento na Marginal Tietê após chuva forte impede a circulação do transporte coletivo.",
        "en": "Flooding on Marginal Tietê after heavy rainfall is completely blocking public transit flow.",
        "cat": "Transport & Logistics",
        "chan": "telegram",
    },
    {
        "pt": "O semáforo do cruzamento principal da Av. Paulista com Brigadeiro está quebrado há 3 horas.",
        "en": "Traffic lights at the main Paulista and Brigadeiro avenue intersection broken for 3 hours, causing gridlock.",
        "cat": "Transport & Logistics",
        "chan": "whatsapp",
    },
    {
        "pt": "Bueiros entupidos na Rua da Consolação estão provocando enxurrada e invadindo a calçada.",
        "en": "Clogged storm drains on Rua da Consolação causing street runoff overflow into pedestrian walkways.",
        "cat": "Transport & Logistics",
        "chan": "web",
    },
    {
        "pt": "A estação de transferência de ônibus em Pinheiros está sem sinalização digital e com superlotação extrema.",
        "en": "Pinheiros bus terminal is experiencing severe overcrowding and digital schedule board failure.",
        "cat": "Transport & Logistics",
        "chan": "whatsapp",
    },
    {
        "pt": "Buraco de grande porte na pista direita da Av. 23 de Maio furando pneus e causando acidentes.",
        "en": "Large pothole on the right lane of Av. 23 de Maio causing severe tire blowouts and traffic hazard.",
        "cat": "Transport & Logistics",
        "chan": "telegram",
    },
]

NEW_DELHI_SIGNALS = [
    {
        "hi": "हमारे इलाके में पिछले 48 घंटों से मुख्य पाइपलाइन फटने के कारण पीने का पानी पूरी तरह बंद है।",
        "en": "Potable water supply completely shut down for 48 hours due to a primary feeder pipeline rupture.",
        "cat": "Water & Sanitation",
        "chan": "whatsapp",
    },
    {
        "hi": "गंदे और बदबूदार पानी की आपूर्ति हो रही है, जिससे बच्चों में पेट की बीमारियां फैल रही हैं।",
        "en": "Contaminated and foul-smelling tap water being supplied, causing stomach illnesses in children.",
        "cat": "Water & Sanitation",
        "chan": "twilio_voice",
    },
    {
        "hi": "पानी का सरकारी टैंकर पिछले तीन दिनों से रोहिणी सेक्टर 16 में नहीं आया है।",
        "en": "Municipal emergency water tanker has not arrived in Rohini Sector 16 for three days.",
        "cat": "Water & Sanitation",
        "chan": "whatsapp",
    },
    {
        "hi": "भूजल स्तर में भारी गिरावट आई है, बोरवेल पूरी तरह सूख चुके हैं।",
        "en": "Sharp drop in groundwater level; community borewells have completely dried up.",
        "cat": "Water & Sanitation",
        "chan": "sms",
    },
    {
        "hi": "सीवर लाइन ओवरफ्लो होकर पीने के पानी के स्रोत में मिल रही है, तत्काल मरम्मत की आवश्यकता है।",
        "en": "Sewage line overflow contaminating nearby potable water junction; urgent repair needed.",
        "cat": "Water & Sanitation",
        "chan": "whatsapp",
    },
    {
        "hi": "द्वारका मोड़ के पास मुख्य जल आपूर्ति वॉल्व लीक हो रहा है और लाखों लीटर पानी बर्बाद हो रहा है।",
        "en": "Main water valve leaking near Dwarka Mor, wasting millions of liters of treated water.",
        "cat": "Water & Sanitation",
        "chan": "telegram",
    },
]

CAPE_TOWN_SIGNALS = [
    {
        "zu": "Ugesi ucimile eKhayelitsha kusukela ekuseni, imtholampilo ayikwazi ukusebenza.",
        "en": "Power outage in Khayelitsha since morning; community clinics unable to operate medical gear.",
        "cat": "Grid & Power",
        "chan": "twilio_voice",
    },
    {
        "zu": "Ukucinywa kukagesi (Load shedding) kudale ukuthi iziqandisi zokugcina imithi zicashe.",
        "en": "Stage 6 load shedding causing critical vaccine cold-chain refrigeration units to fail.",
        "cat": "Grid & Power",
        "chan": "whatsapp",
    },
    {
        "zu": "I-substation kagesi e-Mitchells Plain idubule izolo ebusuku, indawo yonke isebumnyameni.",
        "en": "Electrical substation in Mitchells Plain exploded last night, leaving entire area in darkness.",
        "cat": "Grid & Power",
        "chan": "telegram",
    },
    {
        "zu": "Izibani zomgwaqo azisebenzi ngenxa yokuphela kwamandla, izinga lokuphepha lehlile.",
        "en": "Street lighting completely dark due to grid outage, severely impacting night pedestrian safety.",
        "cat": "Grid & Power",
        "chan": "whatsapp",
    },
    {
        "zu": "Izikole zendawo azikwazi ukuqhuba amakilasi e-computer ngenxa yokucima kukagesi okungapheli.",
        "en": "Local schools unable to conduct digital classes due to unannounced rolling power blackouts.",
        "cat": "Grid & Power",
        "chan": "web",
    },
]


def generate_50_mock_requests():
    """Generates 50 structured citizen requests across the 3 BRICS clusters."""
    requests = []
    now = datetime.now(timezone.utc)

    # Cluster 1: São Paulo, Brazil (18 requests) - Centered around [-23.5505, -46.6333]
    sp_center_lat, sp_center_lon = -23.5505, -46.6333
    for i in range(18):
        template = random.choice(SAO_PAULO_SIGNALS)
        # Scatter within ~4km radius
        lat = round(sp_center_lat + random.uniform(-0.025, 0.025), 6)
        lon = round(sp_center_lon + random.uniform(-0.025, 0.025), 6)
        req_time = now - timedelta(minutes=random.randint(5, 360))
        requests.append({
            "id": str(uuid.uuid4()),
            "timestamp": req_time.isoformat(),
            "channel": template["chan"],
            "original_language": "pt",
            "original_text": template["pt"],
            "english_translation": template["en"],
            "category": template["cat"],
            "latitude": lat,
            "longitude": lon,
            "country": "Brazil",
            "region": "São Paulo Metropolitan Area",
            "raw_metadata": {"source_city": "São Paulo", "seed_cluster": "cluster_sp_transport"},
        })

    # Cluster 2: New Delhi, India (17 requests) - Centered around [28.6139, 77.2090]
    delhi_center_lat, delhi_center_lon = 28.6139, 77.2090
    for i in range(17):
        template = random.choice(NEW_DELHI_SIGNALS)
        lat = round(delhi_center_lat + random.uniform(-0.025, 0.025), 6)
        lon = round(delhi_center_lon + random.uniform(-0.025, 0.025), 6)
        req_time = now - timedelta(minutes=random.randint(2, 300))
        requests.append({
            "id": str(uuid.uuid4()),
            "timestamp": req_time.isoformat(),
            "channel": template["chan"],
            "original_language": "hi",
            "original_text": template["hi"],
            "english_translation": template["en"],
            "category": template["cat"],
            "latitude": lat,
            "longitude": lon,
            "country": "India",
            "region": "National Capital Region (NCR)",
            "raw_metadata": {"source_city": "New Delhi", "seed_cluster": "cluster_delhi_water"},
        })

    # Cluster 3: Cape Town, South Africa (15 requests) - Centered around [-33.9249, 18.4241]
    ct_center_lat, ct_center_lon = -33.9249, 18.4241
    for i in range(15):
        template = random.choice(CAPE_TOWN_SIGNALS)
        lat = round(ct_center_lat + random.uniform(-0.025, 0.025), 6)
        lon = round(ct_center_lon + random.uniform(-0.025, 0.025), 6)
        req_time = now - timedelta(minutes=random.randint(10, 420))
        requests.append({
            "id": str(uuid.uuid4()),
            "timestamp": req_time.isoformat(),
            "channel": template["chan"],
            "original_language": "zu",
            "original_text": template["zu"],
            "english_translation": template["en"],
            "category": template["cat"],
            "latitude": lat,
            "longitude": lon,
            "country": "South Africa",
            "region": "Western Cape Peninsula",
            "raw_metadata": {"source_city": "Cape Town", "seed_cluster": "cluster_ct_power"},
        })

    return requests


async def seed_database():
    """Inserts mock requests into database and syncs local storage."""
    print("=" * 60)
    print("⚡ CivicPulse BRICS - Seeding 50 Citizen Requests")
    print("=" * 60)

    requests = generate_50_mock_requests()

    # Save to JSON file as fallback for standalone / demo mode
    data_dir = Path(__file__).parent / "app" / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    json_path = data_dir / "seeded_requests.json"

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(requests, f, ensure_ascii=False, indent=2)

    print(f"✓ Saved 50 requests to fallback catalog: {json_path}")

    # Attempt PostgreSQL database persistence if available
    db_seeded_count = 0
    try:
        from app.core.database import AsyncSessionLocal
        from app.models.citizen_request import CitizenRequest
        from geoalchemy2.elements import WKTElement

        async with AsyncSessionLocal() as session:
            for req in requests:
                point_geom = WKTElement(f"POINT({req['longitude']} {req['latitude']})", srid=4326)
                citizen_obj = CitizenRequest(
                    id=uuid.UUID(req["id"]),
                    timestamp=datetime.fromisoformat(req["timestamp"]),
                    channel=req["channel"],
                    original_language=req["original_language"],
                    original_text=req["original_text"],
                    english_translation=req["english_translation"],
                    category=req["category"],
                    latitude=req["latitude"],
                    longitude=req["longitude"],
                    location=point_geom,
                    raw_metadata=req["raw_metadata"],
                )
                session.add(citizen_obj)
            await session.commit()
            db_seeded_count = len(requests)
            print(f"✓ Successfully inserted {db_seeded_count} records into PostgreSQL/PostGIS database.")
    except Exception as e:
        print(f"ℹ PostgreSQL not connected or offline ({type(e).__name__}). JSON catalog active.")

    print("\n📊 Cluster Breakdown Summary:")
    print("  1. São Paulo, Brazil   : 18 signals (Transport & Urban Mobility in Portuguese)")
    print("  2. New Delhi, India    : 17 signals (Water Access & Aquifer Stress in Hindi)")
    print("  3. Cape Town, S. Africa: 15 signals (Electricity & Load Shedding in isiZulu)")
    print(f"Total: {len(requests)} verified multi-channel events ready for DBSCAN clustering.\n")


if __name__ == "__main__":
    asyncio.run(seed_database())
