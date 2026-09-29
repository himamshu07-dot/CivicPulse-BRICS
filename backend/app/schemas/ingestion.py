from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TextIngestionPayload(BaseModel):
    """
    Schema for citizen inputs received via web portal, voice-to-text, WhatsApp, or Telegram.
    """
    channel: str = Field(
        default="web",
        description="Source platform: web, voice, whatsapp, telegram, sms",
        example="web",
    )
    text: str = Field(
        ...,
        description="Raw incoming message text in native vernacular",
        example="हमारे इलाके में पीने का पानी 3 दिनों से बंद है और पाइपलाइन टूट गई है।",
    )
    source_language: Optional[str] = Field(
        default=None,
        description="Optional language code (e.g., 'hi', 'pt', 'ru', 'zh', 'ar', 'en')",
        example="hi",
    )
    latitude: Optional[float] = Field(
        default=None,
        description="WGS84 Latitude",
        example=28.6139,
    )
    longitude: Optional[float] = Field(
        default=None,
        description="WGS84 Longitude",
        example=77.2090,
    )
    country: Optional[str] = Field(
        default=None,
        description="Optional BRICS country name",
        example="India",
    )
    region: Optional[str] = Field(
        default=None,
        description="Optional administrative region or city",
        example="New Delhi",
    )
    timestamp: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of the inbound event",
    )
    sender_metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Raw channel metadata or voice parameters",
    )


class VoiceIngestionMetadata(BaseModel):
    """
    Metadata sent alongside multipart voice memo uploads.
    """
    channel: str = Field(default="voice", example="voice")
    source_language: Optional[str] = Field(default=None, example="pt")
    latitude: Optional[float] = Field(default=None, example=-23.5505)
    longitude: Optional[float] = Field(default=None, example=-46.6333)
    country: Optional[str] = Field(default=None, example="Brazil")
    region: Optional[str] = Field(default=None, example="São Paulo")
    timestamp: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class IngestionResponse(BaseModel):
    """
    Response returned after AI processing, translation, classification, and DBMS storage.
    """
    status: str = "success"
    request_id: str
    channel: str
    original_language: str
    original_text_sanitized: str
    english_translation: str
    category: str
    urgency: str = "MEDIUM"
    urgency_score: float = 50.0
    is_duplicate: bool = False
    duplicate_count: int = 1
    country: Optional[str] = None
    region: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timestamp: datetime
    pii_redacted: bool = True
