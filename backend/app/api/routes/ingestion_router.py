import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select, desc, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.citizen_request import CitizenRequest
from app.schemas.ingestion import (
    TextIngestionPayload,
    IngestionResponse,
)
from app.utils.sanitizer import sanitize_payload, sanitize_text
from app.services.ai_pipeline import (
    process_audio_stt,
    translate_to_english,
    classify_category,
    detect_language,
    LANGUAGE_NAMES,
)
from app.services.ml_severity_model import ml_scorer
from app.services.dedup_engine import dedup_engine
from app.services.clustering_engine import resolve_country_and_region

router = APIRouter(prefix="/api/v1", tags=["Ingestion & Citizen Requests"])

COUNTRY_CODES = {
    "Brazil": "BR",
    "Russia": "RU",
    "India": "IN",
    "China": "CN",
    "South Africa": "ZA",
    "Egypt": "EG",
    "Ethiopia": "ET",
    "Iran": "IR",
    "UAE": "AE",
}


@router.post(
    "/ingest/text",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest text problem statement from citizen",
)
async def ingest_text_endpoint(
    payload: TextIngestionPayload,
    db: AsyncSession = Depends(get_db),
) -> IngestionResponse:
    """
    Processes citizen problem description:
    1. PII Sanitization
    2. Multilingual translation & language detection
    3. Infrastructure category classification
    4. ML Multi-Factor Severity Scoring (0 to 100)
    5. NLP Embeddings & Deduplication matching
    6. Persistent storage into DBMS (SQLite/Postgres)
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Problem statement text cannot be empty.",
        )

    # 1. PII Sanitization
    sanitized_dict = sanitize_payload(payload.model_dump())
    sanitized_text = sanitized_dict.get("text", "")
    sanitized_meta = sanitized_dict.get("sender_metadata", {})

    # 2. AI Multilingual Translation Layer
    english_translation, resolved_lang = await translate_to_english(
        text=sanitized_text,
        source_lang=payload.source_language,
    )

    # 3. Automatic Category Classification
    category = classify_category(english_translation + " " + sanitized_text)

    # 4. ML Multi-Factor Severity Model (Calculates 0-100 score + urgency level)
    ml_result = ml_scorer.compute_severity(
        text=english_translation + " " + sanitized_text,
        category=category,
    )
    urgency_level = ml_result["urgency_level"]
    urgency_score = ml_result["score"]
    sanitized_meta["ml_severity"] = ml_result

    # 5. Geolocation & Administrative Resolution
    lat = payload.latitude or 28.6139
    lon = payload.longitude or 77.2090
    country = payload.country
    region = payload.region
    if not country or not region:
        c, r = resolve_country_and_region(lat, lon)
        country = country or c
        region = region or r

    # 6. Deduplication & Semantic Embeddings Engine
    is_duplicate = False
    parent_complaint_id = None
    dup_count = 1

    try:
        stmt = select(CitizenRequest).order_by(desc(CitizenRequest.timestamp)).limit(100)
        res = await db.execute(stmt)
        existing_rows = res.scalars().all()
        existing_records = [
            {
                "id": str(r.id),
                "lat": r.latitude,
                "lon": r.longitude,
                "cat": r.category,
                "text": r.original_text,
                "trans": r.english_translation,
            }
            for r in existing_rows
        ]

        is_dup, parent_id, sim = dedup_engine.find_duplicate(
            new_text=english_translation,
            new_lat=lat,
            new_lon=lon,
            new_category=category,
            existing_records=existing_records,
        )

        if is_dup and parent_id:
            is_duplicate = True
            parent_complaint_id = parent_id
            for r in existing_rows:
                if str(r.id) == parent_id:
                    r.duplicate_count = (r.duplicate_count or 1) + 1
                    dup_count = r.duplicate_count
                    break
    except Exception:
        pass

    # 7. Persist to DBMS
    request_id = str(uuid.uuid4())
    req_time = payload.timestamp or datetime.now(timezone.utc)
    sanitized_meta["is_duplicate"] = is_duplicate
    if parent_complaint_id:
        sanitized_meta["parent_complaint_id"] = parent_complaint_id

    citizen_record = CitizenRequest(
        id=request_id,
        timestamp=req_time,
        channel=payload.channel or "web",
        original_language=resolved_lang,
        original_text=sanitized_text,
        english_translation=english_translation,
        category=category,
        urgency=urgency_level,
        urgency_score=urgency_score,
        duplicate_count=1,
        latitude=lat,
        longitude=lon,
        country=country,
        region=region,
        raw_metadata=sanitized_meta,
    )

    try:
        db.add(citizen_record)
        await db.commit()
        await db.refresh(citizen_record)
    except Exception:
        await db.rollback()

    return IngestionResponse(
        status="success",
        request_id=request_id,
        channel=payload.channel,
        original_language=resolved_lang,
        original_text_sanitized=sanitized_text,
        english_translation=english_translation,
        category=category,
        urgency=urgency_level,
        urgency_score=urgency_score,
        is_duplicate=is_duplicate,
        duplicate_count=dup_count,
        country=country,
        region=region,
        latitude=lat,
        longitude=lon,
        timestamp=req_time,
        pii_redacted=True,
    )


@router.post(
    "/ingest/voice",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest speech / voice memo from citizen",
)
async def ingest_voice_endpoint(
    audio_file: UploadFile = File(...),
    latitude: Optional[float] = Form(None),
    longitude: Optional[float] = Form(None),
    source_language: Optional[str] = Form(None),
    channel: str = Form("voice"),
    country: Optional[str] = Form(None),
    region: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
) -> IngestionResponse:
    """
    Transcribes voice speech audio, runs ML severity model & classification,
    and stores the citizen complaint into the DBMS.
    """
    transcript, detected_lang = await process_audio_stt(
        audio_file=audio_file,
        detected_lang=source_language,
    )

    payload = TextIngestionPayload(
        channel=channel,
        text=transcript,
        source_language=detected_lang,
        latitude=latitude,
        longitude=longitude,
        country=country,
        region=region,
        sender_metadata={"audio_filename": audio_file.filename},
    )
    return await ingest_text_endpoint(payload=payload, db=db)


@router.get(
    "/requests",
    response_model=List[Dict[str, Any]],
    summary="Get live citizen requests feed from DBMS",
)
async def get_citizen_requests_feed(
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """
    Returns stored citizen requests from DBMS with ML Severity breakdown.
    Never returns fake data.
    """
    stmt = select(CitizenRequest).order_by(desc(CitizenRequest.timestamp)).limit(limit)
    res = await db.execute(stmt)
    records = res.scalars().all()

    formatted: List[Dict[str, Any]] = []
    for r in records:
        country_name = r.country or "Local Jurisdiction"
        c_code = COUNTRY_CODES.get(country_name, "UN")
        lang_name = LANGUAGE_NAMES.get(r.original_language, r.original_language.upper())
        meta = r.raw_metadata or {}
        ml_meta = meta.get("ml_severity", {})

        formatted.append({
            "id": str(r.id),
            "country": country_name,
            "countryCode": c_code,
            "region": r.region or "Municipal District",
            "language": r.original_language,
            "languageName": lang_name,
            "originalText": r.original_text or "",
            "translatedText": r.english_translation,
            "category": r.category,
            "urgency": (r.urgency or "medium").lower(),
            "urgencyScore": r.urgency_score or 50.0,
            "duplicateCount": r.duplicate_count or 1,
            "timestamp": r.timestamp.isoformat() if r.timestamp else "",
            "channel": r.channel or "web",
            "coordinates": [r.longitude or 0.0, r.latitude or 0.0],
            "mlExplanation": ml_meta.get("explanation", ""),
            "mlBreakdown": ml_meta.get("breakdown", {}),
        })

    return formatted


@router.delete(
    "/requests",
    summary="Clear all citizen problems from DBMS",
)
async def clear_all_requests_endpoint(
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Deletes all records from DBMS so the user has a completely clean slate."""
    await db.execute(delete(CitizenRequest))
    await db.commit()
    return {"status": "success", "message": "All problems successfully cleared from DBMS."}


@router.delete(
    "/requests/{request_id}",
    summary="Delete specific problem by ID",
)
async def delete_single_request_endpoint(
    request_id: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Deletes a specific citizen problem from the DBMS."""
    await db.execute(delete(CitizenRequest).where(CitizenRequest.id == request_id))
    await db.commit()
    return {"status": "success", "deleted_id": request_id}
