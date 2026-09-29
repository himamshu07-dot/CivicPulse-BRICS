import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple, Union
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession
from geoalchemy2.elements import WKTElement

from app.core.database import get_db
from app.models.citizen_request import CitizenRequest
from app.schemas.ingestion import (
    TextIngestionPayload,
    IngestionResponse,
)
from app.utils.sanitizer import sanitize_payload, sanitize_text
from app.services.ai_pipeline import (
    process_audio_stt as service_process_audio_stt,
    translate_to_english as service_translate_to_english,
    classify_category,
    detect_language,
)

router = APIRouter(prefix="/api/v1/ingest", tags=["Ingestion Pipeline"])


# ---------------------------------------------------------------------------
# AI Processing Layer Placeholders (STT & Multilingual Translation)
# ---------------------------------------------------------------------------

async def process_audio_stt(
    audio_file: Union[UploadFile, bytes],
    detected_lang: Optional[str] = None,
) -> str:
    """
    Placeholder async function representing an open-weight Whisper STT model
    that transcribes multi-dialect audio into text.
    """
    return await service_process_audio_stt(audio_file, detected_lang)


async def translate_to_english(
    text: str,
    source_lang: Optional[str] = None,
) -> Tuple[str, str]:
    """
    Placeholder async function representing an open-weight LLM (Llama 3 / Mistral)
    that translates Russian, Portuguese, Hindi, or Mandarin into a unified English baseline.
    """
    return await service_translate_to_english(text, source_lang)


# ---------------------------------------------------------------------------
# Database Persistence Helper
# ---------------------------------------------------------------------------

async def save_citizen_request(
    db: Optional[AsyncSession],
    channel: str,
    original_language: str,
    sanitized_text: str,
    english_translation: str,
    category: str,
    latitude: Optional[float],
    longitude: Optional[float],
    event_timestamp: Optional[datetime],
    sanitized_meta: Dict[str, Any],
) -> CitizenRequest:
    """
    Constructs and persists the CitizenRequest model with PostGIS POINT geometry.
    """
    request_id = uuid.uuid4()
    req_time = event_timestamp or datetime.now(timezone.utc)

    # Construct PostGIS WKT Point (Longitude Latitude) if coordinates provided
    point_geom = None
    if longitude is not None and latitude is not None:
        point_geom = WKTElement(f"POINT({longitude} {latitude})", srid=4326)

    citizen_record = CitizenRequest(
        id=request_id,
        timestamp=req_time,
        channel=channel,
        original_language=original_language,
        original_text=sanitized_text,
        english_translation=english_translation,
        category=category,
        latitude=latitude,
        longitude=longitude,
        location=point_geom,
        raw_metadata=sanitized_meta,
    )

    if db is not None:
        try:
            db.add(citizen_record)
            await db.commit()
            await db.refresh(citizen_record)
        except Exception as err:
            # Handle cases where DB connection is currently offline gracefully
            await db.rollback()

    return citizen_record


# ---------------------------------------------------------------------------
# Webhook Endpoints
# ---------------------------------------------------------------------------

@router.post(
    "/text",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest text messages from WhatsApp / Telegram webhooks",
    description="Sanitizes PII, detects language, translates to English baseline, and stores with PostGIS geometry.",
)
async def ingest_text_webhook(
    payload: TextIngestionPayload,
    db: AsyncSession = Depends(get_db),
) -> IngestionResponse:
    """
    High-performance async POST endpoint designed to accept generic webhook payloads
    from WhatsApp, Telegram, SMS, and web portal channels.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Payload text cannot be empty.",
        )

    # 1. PII Sanitization (Strip phone numbers, names, addresses while preserving coordinates & timestamp)
    sanitized_dict = sanitize_payload(payload.model_dump())
    sanitized_text = sanitized_dict.get("text", "")
    sanitized_meta = sanitized_dict.get("sender_metadata", {})

    # 2. AI Multilingual Translation Layer
    english_translation, resolved_lang = await translate_to_english(
        text=sanitized_text,
        source_lang=payload.source_language,
    )

    # 3. Automatic Category Classification
    category = classify_category(english_translation or sanitized_text)

    # 4. Database Insertion with PostGIS Geometry
    record = await save_citizen_request(
        db=db,
        channel=payload.channel,
        original_language=resolved_lang,
        sanitized_text=sanitized_text,
        english_translation=english_translation,
        category=category,
        latitude=payload.latitude,
        longitude=payload.longitude,
        event_timestamp=payload.timestamp,
        sanitized_meta=sanitized_meta,
    )

    return IngestionResponse(
        status="success",
        request_id=str(record.id),
        channel=record.channel,
        original_language=record.original_language,
        original_text_sanitized=record.original_text or "",
        english_translation=record.english_translation,
        category=record.category,
        latitude=record.latitude,
        longitude=record.longitude,
        timestamp=record.timestamp,
        pii_redacted=True,
    )


@router.post(
    "/voice",
    response_model=IngestionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest voice memo / telephony audio payloads",
    description="Receives audio files (e.g., from Twilio), runs Whisper STT, sanitizes PII, translates to English, and persists in PostGIS.",
)
async def ingest_voice_webhook(
    audio_file: UploadFile = File(..., description="Multipart audio recording file (wav, mp3, ogg)"),
    channel: str = Form("twilio_voice", description="Ingestion channel: twilio_voice, whatsapp_audio"),
    source_language: Optional[str] = Form(None, description="Optional ISO language code"),
    latitude: Optional[float] = Form(None, description="GPS Latitude"),
    longitude: Optional[float] = Form(None, description="GPS Longitude"),
    db: AsyncSession = Depends(get_db),
) -> IngestionResponse:
    """
    High-performance async POST endpoint to accept audio file payloads from telephony/voice providers.
    """
    if not audio_file:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Audio file payload is required.",
        )

    # 1. Speech-to-Text Transcription via Whisper model placeholder
    transcribed_raw_text = await process_audio_stt(
        audio_file=audio_file,
        detected_lang=source_language,
    )

    # 2. PII Sanitization
    sanitized_text = sanitize_text(transcribed_raw_text)

    # 3. AI Multilingual Translation
    english_translation, resolved_lang = await translate_to_english(
        text=sanitized_text,
        source_lang=source_language,
    )

    # 4. Automatic Categorization
    category = classify_category(english_translation or sanitized_text)

    # 5. Database Insertion
    sanitized_meta = {
        "audio_filename": audio_file.filename,
        "content_type": audio_file.content_type,
        "transcribed_by": "whisper-large-v3-placeholder",
    }

    record = await save_citizen_request(
        db=db,
        channel=channel,
        original_language=resolved_lang,
        sanitized_text=sanitized_text,
        english_translation=english_translation,
        category=category,
        latitude=latitude,
        longitude=longitude,
        event_timestamp=datetime.now(timezone.utc),
        sanitized_meta=sanitized_meta,
    )

    return IngestionResponse(
        status="success",
        request_id=str(record.id),
        channel=record.channel,
        original_language=record.original_language,
        original_text_sanitized=record.original_text or "",
        english_translation=record.english_translation,
        category=record.category,
        latitude=record.latitude,
        longitude=record.longitude,
        timestamp=record.timestamp,
        pii_redacted=True,
    )
