from datetime import datetime, timezone
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class TextIngestionPayload(BaseModel):
    """
    Generic webhook schema capable of accepting WhatsApp, Telegram, or SMS payloads.
    """
    channel: str = Field(
        default="whatsapp",
        description="Source platform: whatsapp, telegram, twilio, sms, web",
        example="whatsapp",
    )
    text: str = Field(
        ...,
        description="Raw incoming message text in native vernacular",
        example="हमारे गांव के अस्पताल में 2 दिनों से डॉक्टर नहीं हैं। फोन: +91 98765 43210, पता: मकान नंबर 42, गांधी मार्ग",
    )
    source_language: Optional[str] = Field(
        default=None,
        description="Optional language code if provided by client (e.g., 'hi', 'pt', 'ru')",
        example="hi",
    )
    latitude: Optional[float] = Field(
        default=None,
        description="WGS84 Latitude of the request origin",
        example=25.5941,
    )
    longitude: Optional[float] = Field(
        default=None,
        description="WGS84 Longitude of the request origin",
        example=85.1376,
    )
    timestamp: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of the inbound event",
    )
    sender_metadata: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Raw channel metadata (sender ID, carrier, message IDs)",
    )


class VoiceIngestionMetadata(BaseModel):
    """
    Metadata sent alongside multipart voice memo uploads (e.g. from Twilio or voice bots).
    """
    channel: str = Field(default="twilio_voice", example="twilio_voice")
    source_language: Optional[str] = Field(default=None, example="pt")
    latitude: Optional[float] = Field(default=None, example=-12.9714)
    longitude: Optional[float] = Field(default=None, example=-38.5014)
    timestamp: Optional[datetime] = Field(default_factory=lambda: datetime.now(timezone.utc))


class IngestionResponse(BaseModel):
    """
    Response schema returned after sanitization, AI translation, and persistence.
    """
    status: str = "success"
    request_id: str
    channel: str
    original_language: str
    original_text_sanitized: str
    english_translation: str
    category: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    timestamp: datetime
    pii_redacted: bool = True
